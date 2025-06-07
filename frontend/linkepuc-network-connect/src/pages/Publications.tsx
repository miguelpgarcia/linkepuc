
import { Header } from "@/components/layout/Header";
import { CreatePostForm } from "@/components/post/CreatePostForm";
import { PostCard } from "@/components/post/PostCard";
import { CurriculumUpload } from "@/components/publications/CurriculumUpload";
import { OpportunityTypesList } from "@/components/publications/OpportunityTypesList";
import { UserProfile } from "@/components/publications/UserProfile";
import { RecentOpportunities } from "@/components/publications/RecentOpportunities";

const posts = [
  {
    id: "1",
    author: {
      id: "101",
      name: "Prof. Maria Silva",
      role: "Professora, Departamento de Computação",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    },
    timeAgo: "1h",
    content: "Feliz em anunciar a publicação do nosso novo artigo sobre aprendizado de máquina aplicado à detecção de padrões em dados genômicos. Um trabalho incrível da nossa equipe de pesquisa!",
    likes: 24,
    comments: 5,
  },
  {
    id: "2",
    author: {
      id: "102",
      name: "Carlos Mendes",
      role: "Estudante, Engenharia de Computação",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    },
    timeAgo: "3h",
    content: "Alguém mais está participando do hackathon deste final de semana? Estou procurando formar uma equipe!",
    likes: 12,
    comments: 8,
  },
  {
    id: "3",
    author: {
      id: "103",
      name: "Ana Carolina",
      role: "Estudante, Departamento de Design",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=240&q=80",
    },
    timeAgo: "5h",
    content: "Acabei de finalizar meu projeto de design de interação para o curso de IHC. Foi um desafio incrível explorar a usabilidade em interfaces para aplicações de saúde!",
    image: "https://images.unsplash.com/photo-1563986768609-322da09575cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    likes: 37,
    comments: 12,
  },
];

export default function Publications() {
  return (
    <div className="min-h-screen bg-muted/20">
      <Header />
      <main>
        <div className="container py-8">
          <CurriculumUpload />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <CreatePostForm />
              {posts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
            
            <div>
              <UserProfile />
              <RecentOpportunities />
            </div>
          </div>

          <div className="mt-16">
            <OpportunityTypesList />
          </div>
        </div>
      </main>
    </div>
  );
}
