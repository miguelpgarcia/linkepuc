import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Save, Loader2 } from "lucide-react";
import { apiFetch } from "@/apiFetch";
import { API_ENDPOINTS } from "@/config/api";
import { useToast } from "@/hooks/use-toast";

interface Interest {
  id: number;
  nome: string;
  categoria?: string;
}

interface InterestsEditorProps {
  currentInterests: Interest[];
  userId: number;
  onSave: (newInterests: Interest[]) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function InterestsEditor({ 
  currentInterests, 
  userId, 
  onSave, 
  onCancel, 
  isLoading = false 
}: InterestsEditorProps) {
  const [availableInterests, setAvailableInterests] = useState<Record<string, Interest[]>>({});
  const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Initialize selected interests
  useEffect(() => {
    setSelectedInterestIds(currentInterests.map(interest => interest.id));
  }, [currentInterests]);

  // Fetch available interests
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        const response = await apiFetch(API_ENDPOINTS.INTERESSES.BASE);
        if (!response.ok) throw new Error("Failed to fetch interests");
        const data = await response.json();
        setAvailableInterests(data);
      } catch (error) {
        toast({
          title: "Erro ao carregar interesses",
          description: "Não foi possível carregar a lista de interesses.",
          variant: "destructive",
        });
      }
    };

    fetchInterests();
  }, [toast]);

  const handleInterestToggle = (interestId: number) => {
    setSelectedInterestIds(prev => 
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSave = async () => {
    if (isSaving) return; // Prevent multiple simultaneous requests
    
    setIsSaving(true);
    try {
      // Get all interests from all categories
      const allInterests = Object.values(availableInterests).flat();
      
      // Get the names of selected interests
      const selectedInterestNames = allInterests
        .filter(interest => selectedInterestIds.includes(interest.id))
        .map(interest => interest.nome);

      const response = await apiFetch(API_ENDPOINTS.INTERESSES.BY_USER_ID(userId), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedInterestNames),
      });

      if (!response.ok) throw new Error("Failed to update interests");

      // Get the updated interests to pass back
      const updatedInterests = allInterests.filter(interest => 
        selectedInterestIds.includes(interest.id)
      );
      
      onSave(updatedInterests);
      
      toast({
        title: "Interesses atualizados",
        description: "Seus interesses foram salvos com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os interesses.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Get all interests from all categories for selection display
  const allInterests = Object.values(availableInterests).flat();
  const selectedInterests = allInterests.filter(interest => 
    selectedInterestIds.includes(interest.id)
  );

  return (
    <div className="space-y-4">
      {/* Selected Interests Preview */}
      <div>
        <Label className="text-sm font-medium">Interesses selecionados:</Label>
        <div className="flex flex-wrap gap-2 mt-2 min-h-[32px] p-2 border rounded-md bg-muted/20">
          {selectedInterests.length > 0 ? (
            selectedInterests.map((interest) => (
              <Badge key={interest.id} variant="secondary" className="flex items-center gap-1">
                {interest.nome}
                <button
                  type="button"
                  onClick={() => handleInterestToggle(interest.id)}
                  className="hover:text-destructive"
                  disabled={isSaving}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          ) : (
            <span className="text-muted-foreground text-sm">Nenhum interesse selecionado</span>
          )}
        </div>
      </div>

      {/* Available Interests */}
      <div>
        <Label className="text-sm font-medium">Selecionar interesses:</Label>
        <div className="space-y-4 mt-2 max-h-60 overflow-y-auto border rounded-md p-3">
          {Object.entries(availableInterests).map(([categoria, interests]) => (
            <div key={categoria} className="space-y-2">
              <h4 className="font-medium text-sm text-gray-900">{categoria}</h4>
              <div className="grid grid-cols-2 gap-2">
                {interests.map((interest) => (
                  <div key={interest.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`interest-${interest.id}`}
                      checked={selectedInterestIds.includes(interest.id)}
                      onCheckedChange={() => handleInterestToggle(interest.id)}
                      disabled={isSaving}
                    />
                    <Label 
                      htmlFor={`interest-${interest.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {interest.nome}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Salvar Interesses
        </Button>
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
      </div>
    </div>
  );
} 