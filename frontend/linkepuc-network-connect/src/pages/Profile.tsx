import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Edit3, Save, X, Camera, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/apiFetch";
import { useAuth } from "@/AuthContext";
import { useState, useMemo, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";

interface UserProfile {
  id: number;
  usuario: string;
  email: string;
  ehaluno: boolean;
  sobre: string | null;
  avatar: string | null;
  criado_em: string;
  email_verified: boolean;
  interesses: Array<{
    id: number;
    nome: string;
  }>;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSobre, setEditedSobre] = useState("");
  const [editedUsuario, setEditedUsuario] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Determine which user ID to fetch - URL param or current user
  const targetUserId = useMemo(() => {
    if (id) {
      return parseInt(id, 10);
    }
    return user?.id;
  }, [id, user?.id]);

  // Check if this is the current user's own profile
  const isOwnProfile = useMemo(() => {
    return !id || (user?.id && parseInt(id, 10) === user.id);
  }, [id, user?.id]);

  // Fetch user profile data
  const { data: profileData, isLoading, error } = useQuery<UserProfile>({
    queryKey: ['profile', targetUserId],
    queryFn: async () => {
      if (!targetUserId) throw new Error('User ID not available');
      const response = await apiFetch(`http://localhost:8000/users/${targetUserId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    },
    enabled: !!targetUserId,
  });

  // Upload avatar mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user?.id) throw new Error('User ID not available');
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiFetch(`http://localhost:8000/users/${user.id}/avatar`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload avatar');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar avatar",
        description: "Não foi possível atualizar a foto de perfil. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Delete avatar mutation
  const deleteAvatarMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User ID not available');
      const response = await apiFetch(`http://localhost:8000/users/${user.id}/avatar`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete avatar');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: "Avatar removido",
        description: "Sua foto de perfil foi removida com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao remover avatar",
        description: "Não foi possível remover a foto de perfil. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  // Update profile mutation (only for own profile)
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { usuario: string; sobre: string | null; ehaluno: boolean }) => {
      if (!user?.id) throw new Error('User ID not available');
      const response = await apiFetch(`http://localhost:8000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      setIsEditing(false);
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = () => {
    setEditedSobre(profileData?.sobre || "");
    setEditedUsuario(profileData?.usuario || "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!profileData) return;
    updateProfileMutation.mutate({
      usuario: editedUsuario,
      sobre: editedSobre || null,
      ehaluno: profileData.ehaluno,
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedSobre("");
    setEditedUsuario("");
  };

  const handleAvatarClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Arquivo inválido",
          description: "Por favor, selecione uma imagem válida.",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      uploadAvatarMutation.mutate(file);
    }
  };

  const handleDeleteAvatar = () => {
    if (window.confirm('Tem certeza que deseja remover sua foto de perfil?')) {
      deleteAvatarMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">
            {error?.message === 'User not found' ? 'Usuário não encontrado' : 'Erro ao carregar perfil'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main className="container py-6">
        {/* Profile Header */}
        <Card className="mb-6">
          <div className="relative h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-t-lg">
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <Avatar 
                  className={`h-24 w-24 border-4 border-background ${isOwnProfile ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
                  onClick={handleAvatarClick}
                >
                  <AvatarImage src={profileData.avatar || undefined} />
                  <AvatarFallback className="text-lg">
                    {profileData.usuario.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isOwnProfile && (
                  <div className="absolute -bottom-1 -right-1 flex gap-1">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={handleAvatarClick}
                      disabled={uploadAvatarMutation.isPending}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    {profileData.avatar && (
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0 rounded-full"
                        onClick={handleDeleteAvatar}
                        disabled={deleteAvatarMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <CardContent className="pt-16 pb-6">
            <div className="flex justify-between items-start">
              <div>
                {isEditing && isOwnProfile ? (
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="usuario">Nome</Label>
                    <Input
                      id="usuario"
                      value={editedUsuario}
                      onChange={(e) => setEditedUsuario(e.target.value)}
                      className="max-w-md"
                    />
                  </div>
                ) : (
                  <h1 className="text-2xl font-bold mb-1">{profileData.usuario}</h1>
                )}
                <p className="text-muted-foreground mb-2">
                  {profileData.ehaluno ? "Estudante" : "Professor"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Membro desde {new Date(profileData.criado_em).toLocaleDateString('pt-BR')}
                </p>
                    </div>
              {isOwnProfile && (
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSave}
                        disabled={updateProfileMutation.isPending}
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Salvar
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleEdit} variant="outline" size="sm">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  )}
                </div>
              )}
                </div>
              </CardContent>
            </Card>

        {/* Hidden file input for avatar upload */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {/* Profile Content */}
        <Tabs defaultValue="sobre" className="space-y-4">
          <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
            <TabsTrigger value="interesses">Interesses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sobre">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2" />
                  Sobre
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing && isOwnProfile ? (
                  <div className="space-y-2">
                    <Label htmlFor="sobre">Conte um pouco sobre você</Label>
                    <Textarea
                      id="sobre"
                      value={editedSobre}
                      onChange={(e) => setEditedSobre(e.target.value)}
                      placeholder="Descreva seus interesses, experiências e objetivos..."
                      className="min-h-32"
                    />
                    </div>
                ) : (
                  <div>
                    {profileData.sobre ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {profileData.sobre}
                      </p>
                    ) : (
                      <p className="text-muted-foreground italic">
                        {isOwnProfile 
                          ? "Nenhuma informação adicionada ainda. Clique em \"Editar Perfil\" para adicionar informações sobre você."
                          : "Este usuário não adicionou informações sobre si ainda."
                        }
                      </p>
                    )}
                </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="interesses">
            <Card>
              <CardHeader>
                <CardTitle>Interesses</CardTitle>
              </CardHeader>
              <CardContent>
                {profileData.interesses && profileData.interesses.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profileData.interesses.map((interesse) => (
                      <Badge key={interesse.id} variant="secondary">
                        {interesse.nome}
                      </Badge>
                  ))}
                </div>
                ) : (
                  <p className="text-muted-foreground italic">
                    {isOwnProfile 
                      ? "Nenhum interesse cadastrado ainda. Você pode adicionar interesses através das configurações do seu perfil."
                      : "Este usuário não cadastrou interesses ainda."
                    }
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
