import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ProfessorHeader } from "@/components/layout/ProfessorHeader";
import { useAuth } from "@/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Camera, Edit2, Save, X, Trash2, GraduationCap, BookOpen, MessageCircle } from "lucide-react";
import { apiFetch } from "@/apiFetch";
import { InterestsEditor } from "@/components/InterestsEditor";
import { API_ENDPOINTS } from "@/config/api";

interface UserProfile {
  id: number;
  usuario: string;
  email: string;
  ehaluno: boolean;
  sobre: string | null;
  avatar: string | null;
  interesses: Array<{
    id: number;
    nome: string;
  }>;
  departamento?: string;
  titulo?: string;
}

export default function ProfessorProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine if this is the user's own profile
  const isOwnProfile = !id || (user && parseInt(id) === user.id);
  const profileId = isOwnProfile ? user?.id : parseInt(id!);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isEditingInterests, setIsEditingInterests] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedBio, setEditedBio] = useState("");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Fetch user profile
  const { data: profileData, isLoading } = useQuery<UserProfile>({
    queryKey: ['professor-profile', profileId],
    queryFn: async () => {
      if (!profileId) throw new Error('Profile ID not available');
      const response = await apiFetch(API_ENDPOINTS.USERS.BY_ID(profileId));
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!profileId,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { usuario: string; ehaluno: boolean; sobre: string | null }) => {
      const response = await apiFetch(API_ENDPOINTS.USERS.BY_ID(profileId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professor-profile', profileId] });
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      toast({ title: "Perfil atualizado com sucesso!" });
    },
    onError: () => {
      toast({ title: "Erro ao atualizar perfil", variant: "destructive" });
    },
  });

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiFetch(API_ENDPOINTS.USERS.AVATAR(profileId), {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload avatar');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professor-profile', profileId] });
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      toast({ title: "Foto de perfil atualizada!" });
      setIsUploadingAvatar(false);
    },
    onError: () => {
      toast({ title: "Erro ao enviar foto", variant: "destructive" });
      setIsUploadingAvatar(false);
    },
  });

  // Delete avatar mutation
  const deleteAvatarMutation = useMutation({
    mutationFn: async () => {
      const response = await apiFetch(API_ENDPOINTS.USERS.AVATAR(profileId), {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete avatar');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professor-profile', profileId] });
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      toast({ title: "Foto de perfil removida!" });
    },
    onError: () => {
      toast({ title: "Erro ao remover foto", variant: "destructive" });
    },
  });

  const handleNameEdit = () => {
    setEditedName(profileData?.usuario || "");
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    if (editedName.trim() && profileData) {
      updateProfileMutation.mutate({ 
        usuario: editedName.trim(),
        ehaluno: profileData.ehaluno,
        sobre: profileData.sobre
      });
    }
    setIsEditingName(false);
  };

  const handleBioEdit = () => {
    setEditedBio(profileData?.sobre || "");
    setIsEditingBio(true);
  };

  const handleBioSave = () => {
    if (profileData) {
      updateProfileMutation.mutate({ 
        usuario: profileData.usuario,
        ehaluno: profileData.ehaluno,
        sobre: editedBio || null
      });
    }
    setIsEditingBio(false);
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: "Por favor, selecione uma imagem", variant: "destructive" });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Imagem muito grande. Máximo 5MB", variant: "destructive" });
      return;
    }

    setIsUploadingAvatar(true);
    uploadAvatarMutation.mutate(file);
  };

  const handleStartConversation = () => {
    if (!profileData) return;
    navigate(`/professor/messages?userId=${profileData.id}`);
  };

  const handleInterestsSave = (newInterests: Array<{id: number; nome: string}>) => {
    // Update the profile data in the query cache
    queryClient.setQueryData(['professor-profile', profileId], (oldData: UserProfile | undefined) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        interesses: newInterests
      };
    });
    setIsEditingInterests(false);
  };

  const handleInterestsCancel = () => {
    setIsEditingInterests(false);
  };

  const getUserInitials = () => {
    if (!profileData?.usuario) return "P";
    const names = profileData.usuario.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return profileData.usuario.charAt(0).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ProfessorHeader />
        <div className="container mx-auto py-8">
          <div className="text-center">Carregando perfil...</div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background">
        <ProfessorHeader />
        <div className="container mx-auto py-8">
          <div className="text-center">Perfil não encontrado</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ProfessorHeader />
      <main className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profileData.avatar || undefined} />
                    <AvatarFallback className="text-2xl">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  
                  {isOwnProfile && (
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingAvatar}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                        {profileData.avatar && (
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-8 w-8 p-0"
                            onClick={() => deleteAvatarMutation.mutate()}
                            disabled={deleteAvatarMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {isOwnProfile && (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                )}

                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    {profileData.ehaluno ? "Estudante" : "Professor"}
                  </span>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                {/* Name */}
                <div>
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-2xl font-bold h-auto p-2"
                        onKeyPress={(e) => e.key === 'Enter' && handleNameSave()}
                      />
                      <Button size="sm" onClick={handleNameSave}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditingName(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl font-bold">{profileData.usuario}</h1>
                      {isOwnProfile && (
                        <Button size="sm" variant="ghost" onClick={handleNameEdit}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {/* Email */}
                <p className="text-muted-foreground">{profileData.email}</p>

                {/* Message Button */}
                {!isOwnProfile && (
                  <Button onClick={handleStartConversation} size="sm" className="w-fit">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enviar Mensagem
                  </Button>
                )}

                {/* Department/Title */}
                {(profileData.departamento || profileData.titulo) && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      {profileData.titulo && `${profileData.titulo}`}
                      {profileData.departamento && ` - ${profileData.departamento}`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* About Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Sobre</h2>
              {isOwnProfile && !isEditingBio && (
                <Button size="sm" variant="ghost" onClick={handleBioEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {isEditingBio ? (
              <div className="space-y-4">
                <Textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="Conte um pouco sobre você, sua área de pesquisa, experiência acadêmica..."
                  className="min-h-[120px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleBioSave}>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsEditingBio(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {profileData.sobre || (isOwnProfile ? "Clique no ícone de edição para adicionar informações sobre você." : "Nenhuma informação disponível.")}
              </p>
            )}
          </Card>

          {/* Interests Section */}
          {(profileData.interesses && profileData.interesses.length > 0) || (isOwnProfile && isEditingInterests) ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Áreas de Interesse</h2>
                {isOwnProfile && !isEditingInterests && (
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingInterests(true)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {isEditingInterests && isOwnProfile ? (
                <InterestsEditor
                  currentInterests={profileData.interesses || []}
                  userId={profileData.id}
                  onSave={handleInterestsSave}
                  onCancel={handleInterestsCancel}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profileData.interesses.map((interesse) => (
                    <Badge key={interesse.id} variant="secondary">
                      {interesse.nome}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ) : isOwnProfile ? (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Áreas de Interesse</h2>
                <Button size="sm" variant="ghost" onClick={() => setIsEditingInterests(true)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-muted-foreground italic">
                Nenhum interesse cadastrado ainda. Clique no ícone de edição para adicionar interesses.
              </p>
            </Card>
          ) : null}
        </div>
      </main>
    </div>
  );
} 