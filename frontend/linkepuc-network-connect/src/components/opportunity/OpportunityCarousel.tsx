
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface OpportunitySlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

const slides: OpportunitySlide[] = [
  {
    id: "1",
    title: "Monitoria Acadêmica",
    subtitle: "Compartilhe conhecimento e desenvolva habilidades de ensino",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    link: "/opportunities?type=monitoria"
  },
  {
    id: "2",
    title: "Iniciação Científica",
    subtitle: "Explore a fronteira do conhecimento através da pesquisa",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    link: "/opportunities?type=iniciacao_cientifica"
  },
  {
    id: "3",
    title: "Estágios Profissionais",
    subtitle: "Experiência prática para sua carreira",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    link: "/opportunities?type=estagio"
  },
  {
    id: "4",
    title: "Laboratórios de Pesquisa",
    subtitle: "Tecnologia e inovação em primeira mão",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=1200&q=80",
    link: "/opportunities?type=laboratorio"
  }
];

export function OpportunityCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="relative w-full max-w-[80%] mx-auto">
      <Carousel className="w-full" setApi={(api) => {
        api?.on("select", () => {
          setCurrentSlide(api.selectedScrollSnap());
        });
      }}>
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div 
                className="block relative cursor-pointer" 
                onClick={() => navigate(slide.link)}
              >
                <div className="relative h-[50vh] w-full overflow-hidden rounded-lg">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-xl opacity-90">{slide.subtitle}</p>
                    <Button 
                      variant="secondary" 
                      className="mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(slide.link);
                      }}
                    >
                      Ver oportunidades
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              currentSlide === index ? "bg-white" : "bg-white/50"
            )}
          />
        ))}
      </div>
    </div>
  );
}
