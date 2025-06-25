import * as React from "react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { apiFetch } from "@/apiFetch";
import { API_ENDPOINTS } from "@/config/api";

interface InterestsSelectorProps {
  selectedInterests: string[];
  onInterestsChange: (interests: string[]) => void;
}

export function InterestsSelector({ selectedInterests, onInterestsChange }: InterestsSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [availableInterests, setAvailableInterests] = useState<{ id: number; nome: string }[]>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  // Fetch interests from the backend
  useEffect(() => {
    async function fetchInterests() {
      try {
        const response = await apiFetch(API_ENDPOINTS.INTERESSES.BASE);
        const data = await response.json();
        // Assuming the backend returns an array of objects with an `id` and `nome` field
        const interests = data.map((item: { id: number; nome: string }) => ({
          id: item.id,
          nome: item.nome,
        }));     
        setAvailableInterests(interests);
      } catch (error) {
        console.error("Failed to fetch interests:", error);
      }
    }

    fetchInterests();
  }, []);

  const handleSelect = (interestId: number) => {
    const idStr = String(interestId);
    if (!selectedInterests.includes(idStr)) {
      onInterestsChange([...selectedInterests, idStr]);
    }
    setInputValue("");
    inputRef.current?.focus();
  };
  const handleRemove = (interestId: number | string) => {
    const idStr = String(interestId);
    onInterestsChange(selectedInterests.filter((i) => i !== idStr));
  };
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    const value = inputValue.trim();
    if (!value) return;

    // Add new custom interest when Enter is pressed
    if (e.key === "Enter" && !availableInterests.find(interest => interest.nome.toLowerCase() === value.toLowerCase())) {
      e.preventDefault();
      
      try {
        // Create new interest on backend
        const response = await apiFetch(API_ENDPOINTS.INTERESSES.BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nome: value }),
        });

        if (response.ok) {
          const newInterest = await response.json();
          setAvailableInterests((prev) => [...prev, newInterest]);
          handleSelect(newInterest.id);
        } else {
          // If interest already exists, just try to find it and select
          const existingInterest = availableInterests.find(interest => 
            interest.nome.toLowerCase() === value.toLowerCase()
          );
          if (existingInterest) {
            handleSelect(existingInterest.id);
          }
        }
      } catch (error) {
        console.error("Failed to create interest:", error);
      }
    }
  };

  const filteredInterests = availableInterests.filter(
    (interest) =>
      !selectedInterests.includes(String(interest.id)) &&
      interest.nome.toLowerCase().includes(inputValue.toLowerCase())
  );
  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Áreas de interesse</FormLabel>
        <FormControl>
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedInterests.map((interestId) => {
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
              })}
            </div>
            <Command
              className="rounded-lg border shadow-md"
              onKeyDown={handleKeyDown}
            >
              <div className="flex items-center border-b px-3">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Selecione ou adicione interesses..."
                  className="h-9 w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                />
              </div>
              {filteredInterests.length > 0 && (
                <CommandList>
                  <CommandGroup>
                    {filteredInterests.map((interest) => (
                      <CommandItem
                        key={interest.id}
                        value={interest.nome}
                        onSelect={() => handleSelect(interest.id)}
                      >
                        {interest.nome}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              )}
              {inputValue && !filteredInterests.length && (
                <div className="p-2 text-sm text-muted-foreground">
                  Pressione Enter para adicionar &quot;{inputValue}&quot;
                </div>
              )}
            </Command>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    </div>
  );
}
