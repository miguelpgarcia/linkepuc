import * as React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/apiFetch";
import { API_ENDPOINTS } from "@/config/api";

interface InterestsSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
}

export function InterestsSelector({ selectedInterests, onInterestsChange }: InterestsSelectorProps) {
  const [availableInterests, setAvailableInterests] = useState<{ id: number; nome: string; categoria?: string }[]>([]);
  const [categorizedInterests, setCategorizedInterests] = useState<Record<string, { id: number; nome: string; categoria?: string }[]>>({});
  const [newInterestName, setNewInterestName] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch interests from the backend
  useEffect(() => {
    async function fetchInterests() {
      try {
        const response = await apiFetch(API_ENDPOINTS.INTERESSES.BASE);
        const data = await response.json();
        
        // Keep both the categorized structure and flat array
        setCategorizedInterests(data);
        
        // Convert to flat array for searching and selection
        const interests: { id: number; nome: string; categoria?: string }[] = [];
        Object.entries(data).forEach(([categoria, categoryInterests]: [string, any[]]) => {
          categoryInterests.forEach((interest) => {
            interests.push({
              id: interest.id,
              nome: interest.nome,
              categoria: categoria
            });
          });
        });
        
        setAvailableInterests(interests);
      } catch (error) {
        console.error("Failed to fetch interests:", error);
      }
    }

    fetchInterests();
  }, []);

  const handleInterestToggle = (interestId: number) => {
    const idStr = String(interestId);
    if (selectedInterests.includes(idStr)) {
      onInterestsChange(selectedInterests.filter((i) => i !== idStr));
    } else {
      onInterestsChange([...selectedInterests, idStr]);
    }
  };

  const handleRemove = (interestId: string) => {
    onInterestsChange(selectedInterests.filter((i) => i !== interestId));
  };

  const handleAddNewInterest = async () => {
    const value = newInterestName.trim();
    if (!value) return;

    try {
      // Create new interest on backend
      const response = await apiFetch(API_ENDPOINTS.INTERESSES.BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: value }),
      });

      if (response.ok) {
        const newInterest = await response.json();
        
        // Add to available interests
        setAvailableInterests((prev) => [...prev, { ...newInterest, categoria: "Outros" }]);
        
        // Add to categorized interests (in "Outros" category)
        setCategorizedInterests((prev) => ({
          ...prev,
          "Outros": [...(prev["Outros"] || []), { ...newInterest, categoria: "Outros" }]
        }));
        
        // Select the new interest
        onInterestsChange([...selectedInterests, String(newInterest.id)]);
        
        // Reset form
        setNewInterestName("");
        setIsAddingNew(false);
      }
    } catch (error) {
      console.error("Failed to create interest:", error);
    }
  };

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Áreas de interesse</FormLabel>
        <FormControl>
          <div className="space-y-4">
            {/* Selected Interests Preview */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Interesses selecionados:</Label>
              <div className="flex flex-wrap gap-2 mt-2 min-h-[32px] p-2 border rounded-md bg-muted/20">
                {selectedInterests.length > 0 ? (
                  selectedInterests.map((interestId) => {
                    const interest = availableInterests.find((i) => String(i.id) === interestId);
                    return (
                      <Badge key={interestId} className="px-2 py-1 bg-primary/20 text-primary">
                        {interest?.nome ?? interestId}
                        <button
                          type="button"
                          className="ml-1 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemove(interestId)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })
                ) : (
                  <span className="text-muted-foreground text-sm">Nenhum interesse selecionado</span>
                )}
              </div>
            </div>

            {/* Available Interests by Category */}
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Selecionar interesses:</Label>
              <div className="space-y-4 mt-2 max-h-60 overflow-y-auto border rounded-md p-3">
                {Object.entries(categorizedInterests).map(([categoria, interests]) => (
                  <div key={categoria} className="space-y-2">
                    <h4 className="font-medium text-sm text-gray-900">{categoria}</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {interests.map((interest) => (
                        <div key={interest.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`interest-${interest.id}`}
                            checked={selectedInterests.includes(String(interest.id))}
                            onCheckedChange={() => handleInterestToggle(interest.id)}
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

            {/* Add New Interest */}
            <div className="border-t pt-3">
              {isAddingNew ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Nome do novo interesse..."
                    value={newInterestName}
                    onChange={(e) => setNewInterestName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNewInterest()}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleAddNewInterest} disabled={!newInterestName.trim()}>
                    Adicionar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => {
                    setIsAddingNew(false);
                    setNewInterestName("");
                  }}>
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button 
                  type="button"
                  size="sm" 
                  variant="outline" 
                  onClick={() => setIsAddingNew(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar novo interesse
                </Button>
              )}
            </div>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}
