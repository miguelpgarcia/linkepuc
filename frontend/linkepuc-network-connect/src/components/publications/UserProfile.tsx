
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function UserProfile() {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Seu Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-16 w-16">
            <AvatarImage src="https://images.unsplash.com/photo-1511489731872-324d5f3f0737?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80" />
            <AvatarFallback>JP</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">João Paulo</h3>
            <p className="text-sm text-muted-foreground">Estudante, Ciência da Computação</p>
          </div>
        </div>
        <Link to="/profile">
          <Button variant="outline" className="w-full">Ver Perfil</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
