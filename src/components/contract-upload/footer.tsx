import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { WhatsAppIcon } from "../icons/whatsapp-icon";
import { XLogoIcon } from "../icons/x-logo-icon";

export function ContractUploadFooter() {
  return (
    <div className="w-full border-border-base border-t bg-ui-base py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-8">
        {/* Share Section */}
        <div className="space-y-4 text-center sm:space-y-6">
          <h3 className="font-semibold text-text-base text-xl sm:text-2xl">
            ¿Te ha resultado útil?
          </h3>
          <p className="mx-auto max-w-2xl text-sm text-text-subtle sm:text-base">
            Comparte HipotecaFindr con otros que estén buscando entender mejor
            sus hipotecas.
          </p>
          {/* Social Share Buttons */}
          <div className="mb-8 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-full border-border-base text-text-subtle hover:text-info-base sm:h-9 sm:w-auto"
            >
              <WhatsAppIcon className="mr-2.5 h-4 w-4" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-full border-border-base text-text-subtle hover:text-info-base sm:h-9 sm:w-auto"
            >
              <Mail className="mr-2.5 h-4 w-4" />
              Email
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-full border-border-base text-text-subtle hover:text-info-base sm:h-9 sm:w-auto"
            >
              <XLogoIcon className="mr-2.5 h-4 w-4" />
              Tweet
            </Button>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="mt-auto space-y-4 border-border-base border-t px-4 py-6 text-center sm:space-y-6 sm:px-6 sm:py-8">
          <p className="mx-auto max-w-4xl text-text-soft text-xs leading-relaxed">
            <strong className="text-text-base">Aviso Legal:</strong> Este
            análisis es únicamente informativo y no constituye asesoramiento
            financiero, legal o fiscal. Te recomendamos consultar con un
            profesional antes de tomar decisiones importantes sobre tu hipoteca.
            No nos hacemos responsables de las decisiones tomadas basándose
            exclusivamente en esta información.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 text-text-soft text-xs sm:flex-row sm:gap-6">
            <span className="order-last sm:order-first">
              © {new Date().getFullYear()} HipotecaFindr
            </span>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 sm:gap-x-6">
              <button
                type="button"
                className="transition-colors hover:text-text-base"
              >
                Términos de Uso
              </button>
              <span className="hidden sm:inline">•</span>
              <button
                type="button"
                className="transition-colors hover:text-text-base"
              >
                Política de Privacidad
              </button>
              <span className="hidden sm:inline">•</span>
              <button
                type="button"
                className="transition-colors hover:text-text-base"
              >
                Contacto
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
