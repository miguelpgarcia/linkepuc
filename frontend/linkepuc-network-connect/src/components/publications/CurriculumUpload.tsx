
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function CurriculumUpload() {
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleCvUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setCvFileName(file.name);
    }
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-white to-purple-50 rounded-lg p-6 mb-8 border border-secondary">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-1">Importe seu Currículo Acadêmico</h2>
        <p className="text-muted-foreground text-sm mb-2">
          Facilite o preenchimento de dados do seu perfil importando o seu currículo acadêmico (<span className="italic">PDF</span>).
        </p>
        {cvFileName ? (
          <div className="text-green-700 font-medium flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {cvFileName} importado com sucesso!
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-5 w-5" />
            Importar Currículo
          </Button>
        )}
        <input
          type="file"
          ref={fileInputRef}
          accept="application/pdf"
          className="hidden"
          onChange={handleCvUpload}
        />
      </div>
      <div className="mt-4 md:mt-0">
        <img
          src="https://i.ibb.co/QvHLCCn6/600b30a3-851a-493b-98ca-81653ff0f5bc.png"
          alt="Importar Currículo"
          className="h-20 mx-auto md:mx-0"
        />
      </div>
    </div>
  );
}
