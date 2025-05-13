import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      Landing Page

      <Link href="/projects">
        <button className=""> Commencer </button>
      </Link>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <hr />
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        {/* Description */}
        <div className="max-w-md">
          <h2 className="text-lg font-semibold mb-2">À propos</h2>
          <p className="text-sm text-gray-600">
            Générez rapidement vos diagrammes d'activités pour mieux planifier vos projets.
          </p>
        </div>

        {/* Formulaire de contact simple */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Nous contacter</h2>
          <form
            action="mailto:tonemail@example.com"
            method="POST"
            encType="text/plain"
            className="flex flex-col gap-2"
          >
            <input
              type="email"
              name="email"
              placeholder="Votre e-mail"
              required
              className="p-2 rounded border border-gray-300"
            />
            <textarea
              name="message"
              rows={2}
              placeholder="Votre message"
              required
              className="p-2 rounded border border-gray-300"
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white py-1.5 px-4 rounded hover:bg-blue-700 transition"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500 mt-6">
        © 2025 - DiagrammeApp. Tous droits réservés.
      </div>
    
      </footer>
    </div>
  );
}
