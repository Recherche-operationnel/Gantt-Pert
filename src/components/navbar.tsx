import React from "react";

const Navbar = () => {
  const user = {
    name: "Jean Dupont", // Nom de l'utilisateur
  };

  // Fonction pour obtenir les initiales
  const getInitials = (name:string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="bg-opacity-40 p-4 flex justify-between items-center ">
      {/* Titre de l'application */}
      <h1 className="text-blue-600 text-xl font-bold">Mon Application</h1>

      {/* Profil utilisateur */}
      <div className="flex flex-col items-center">
        <div className="bg-blue-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
          {getInitials(user.name)}
        </div>
        <span className="text-blue-400 text-sm mt-2">{user.name}</span>
      </div>
    </nav>
  );
};

export default Navbar;
