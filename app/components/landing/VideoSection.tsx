"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface VideoSectionProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  testimonialName?: string;
  testimonialRole?: string;
}

/**
 * VideoSection - Seção de depoimento em vídeo com modal
 * REQ-LP-05: Depoimento em vídeo com Dialog modal
 */
export function VideoSection({
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  thumbnailUrl,
  testimonialName = "João Silva",
  testimonialRole = "Proprietário - Pizzaria Bella Napoli",
}: VideoSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="bg-muted/50 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Veja o que nossos clientes dizem
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Depoimentos de donos de restaurantes que transformaram seus negócios
          </p>
        </div>

        {/* Video Card with Dialog Trigger */}
        <div className="mx-auto max-w-lg">
          <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
              <button className="group relative w-full overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl">
                {/* Thumbnail */}
                <div className="aspect-video w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={`Depoimento de ${testimonialName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Play className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  )}

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                      <Play className="h-8 w-8 text-primary-foreground" />
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="bg-card p-4 text-left">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <span className="text-sm font-bold">
                        {testimonialName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{testimonialName}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonialRole}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Depoimento em vídeo
                  </p>
                </div>
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-lg font-semibold">
                    Depoimento: {testimonialName}
                  </DialogTitle>
                  <button
                    onClick={() => handleOpenChange(false)}
                    className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </DialogHeader>

              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                <iframe
                  src={`${videoUrl}${isPlaying ? "?autoplay=1" : ""}`}
                  title={`Depoimento de ${testimonialName}`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">
                  <p className="font-semibold">{testimonialName}</p>
                  <p>{testimonialRole}</p>
                </div>
                <button
                  onClick={togglePlay}
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary"
                >
                  {isPlaying ? (
                    <>
                      <X className="h-4 w-4" />
                      Parar
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      {isPlaying ? "Pausar" : "Reproduzir"}
                    </>
                  )}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}
