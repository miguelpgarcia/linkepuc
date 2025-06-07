
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Image, Paperclip } from "lucide-react";

export function CreatePostForm() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    // Here you would integrate with your backend API
    // Example: await postApi.createPost({ content });
    
    // Simulating API call
    setTimeout(() => {
      setContent("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src="https://images.unsplash.com/photo-1511489731872-324d5f3f0737?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80" />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <Textarea
              placeholder="Compartilhe uma novidade ou artigo..."
              className="resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-3">
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="sm">
              <Image size={18} className="mr-2" />
              Foto
            </Button>
            <Button type="button" variant="ghost" size="sm">
              <Paperclip size={18} className="mr-2" />
              Anexo
            </Button>
          </div>
          <Button 
            type="submit" 
            disabled={!content.trim() || isSubmitting}
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
