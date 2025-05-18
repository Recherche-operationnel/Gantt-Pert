import Image from "next/image";
import Link from "next/link";

export default function Home() {
   const steps = [
    {
      id: '1',
      title: 'Créer un projet',
      description: 'Commencez par créer un nouveau projet.',
    },
    {
      id: '2',
      title: 'Ajouter des tâches',
      description: 'Ajoutez des tâches et définissez les durées.',
    },
    {
      id: '3',
      title: 'Visualiser le projet',
      description: 'Visualisez votre projet dans un tableau ou avec un diagramme de Gantt ou de PERT.',
    }
  ];

  const views = [
    {
      id: '1',
      title: 'Vue standard',
      description: 'Visualisez vos tâches dans un tableau',
      image: '/images/standard.jpg',
    },
    {
      id: '2',
      title: 'Diagramme de Gantt',
      description: 'Visualisez vos tâches dans le temps.',
      image: '/images/gantt.webp',
    },
    {
      id: '3',
      title: 'Diagramme de PERT',
      description: 'Analysez les dépendances entre les tâches.',
      image: '/images/pert.png',
    }
  ];


  return (
    <div className=" items-center justify-items-center max-w-full pb-20 ">
      <div className="mx-auto px-4 w-full bg-[url('/images/Ads1.png')] bg-cover bg-center bg-no-repeat h-screen">
        <div className="flex items-center p-6 justify-around h-full w-full flex-col md:flex-row">
          {/* Texte */}
          <div className="text-center text-white relative z-10 md:text-left md:w-1/2">
            <h1 className="text-5xl font-bold m-4">
              Visualisez vos projets avec des diagrammes d'activités: Gantt&Pert
            </h1>
            <p className="text-xl mb-8 m-4">
              Un moyen simple et efficace de planifier vos projets. Créez vos diagrammes d'activités en quelques clics.
            </p>
            
            <Link href="/projects">
            <button className=" text-xl bg-white hover:text-white hover:bg-blue-700 text-blue-700 font-semibold py-4 px-6 m-4 rounded">
              Commencer
            </button>
            </Link>
          
          </div>

          {/* Image */}
          <div className="relative md:w-1/2 h-64 md:h-auto flex justify-center items-center">
            <Image
              src="/images/gantt.webp"
              alt="diagramme de Gantt"
              width={500}
              height={400}
              objectFit="contain"
            />
          </div>
        </div>
      </div>

     {/* Comment ca marche */}
     <div>
      <h2 className="text-3xl font-bold text-center mt-10 mb-6">
        Comment ça marche ?
      </h2>
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          {steps.map((step) => (
            <div key={step.id} className="bg-white shadow-md rounded-lg p-4 max-w-xs">
               {/* Cercle avec numéro */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-400 text-white text-lg font-semibold shadow-md">
                {step.id}
              </div>
              <p className="mt-2 text-xl font-medium mb-2">{step.title}</p>
              <p className="text-gray-600">{step.description}</p>
            </div>
            </div>
          ))}
        </div>
      </div>
     </div>

     {/* Vues disponibles */}
     <div className="p-6 mb-10">
      <h2 className="text-3xl font-bold text-center mt-10 mb-6">
        Vues disponibles
      </h2>
      <div className="flex flex-col items-center justify-center gap-4">
        
        <div className="flex flex-col md:flex-row gap-4">
          {views.map((view) => (
            <div key={view.id} className="bg-white shadow-md rounded-lg p-4 max-w-xs">
              <Image
                src={view.image}
                alt={view.title}
                width={500}
                height={400}
                objectFit="contain"
                className="rounded-lg mb-4"
              />
              <h3 className="text-xl font-medium mb-2">{view.title}</h3>
              <p className="text-gray-600">{view.description}</p>
            </div>
          ))}
        </div>
      </div>
     </div>

    {/*Qu'est ce que vous attnedez?*/}
    <div className="flex flex-col md:flex-row items-center bg-blue-400 w-full p-10 text-white justify-between">
      <h2 className="text-3xl font-bold text-center mt-10 mb-6">Qu'est ce que vous attendez?</h2>
      <Link href="/projects">
            <button className=" text-xl bg-white hover:text-white hover:bg-blue-700 text-blue-700 font-semibold py-4 px-6 m-4 rounded">
              Commencer
            </button>
            </Link>
    </div>

     {/* Footer */}
      <footer className="bg-gray-50 py-12 px-4 w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">À propos</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Générez rapidement vos diagrammes d'activités pour mieux planifier vos projets. Une solution simple, rapide et intuitive.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Nous contacter</h2>
            <form
              action="mailto:ngom24christine03@gmail.com"
              method="POST"
              encType="text/plain"
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                name="email"
                placeholder="Votre e-mail"
                required
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="message"
                rows={3}
                placeholder="Votre message"
                required
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <button
                type="submit"
                className="self-start bg-blue-600 text-white py-2 px-5 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Envoyer
              </button>
            </form>
          </div>
        </div>

        {/* Ligne séparatrice */}
        <hr className="my-10 border-t border-gray-200" />

        {/* Copyright */}
        <div className="text-center text-sm text-gray-500">
          © 2025 - <span className="font-semibold text-gray-700">DiagrammeApp</span>. Tous droits réservés.
        </div>
      </footer>

    </div>
  );
}
