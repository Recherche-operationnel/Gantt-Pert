

// const PertDiagram = () => {
//   return (
//     <div className="flex flex-col gap-4">
//       La vue du diagram de PERT
      
//     </div>
//   );
// }
// export default PertDiagram;
import React from 'react';

// Types
type Task = {
  name: string;
  duration: number;
  dependencies: string[];
};

type Node = {
  id: number;
  x: number;
  y: number;
  earliest: number;
  latest: number;
};

type Edge = {
  source: number;
  target: number;
  label: string;
  duration: number;
  isCritical: boolean;
};

const PertV3 = () => {
  // Nœuds du diagramme avec positions fixes
  const nodes: Node[] = [
    { id: 1, x: 100, y: 260, earliest: 0, latest: 0 },
    { id: 2, x: 250, y: 120, earliest: 2, latest: 4 },
    { id: 3, x: 250, y: 350, earliest: 4, latest: 4 },
    { id: 4, x: 400, y: 200, earliest: 9, latest: 9 },
    { id: 5, x: 550, y: 200, earliest: 15, latest: 15 },
  ];

  // Arcs du diagramme
  const edges: Edge[] = [
    { source: 1, target: 2, label: "A", duration: 2, isCritical: false },
    { source: 1, target: 3, label: "B", duration: 4, isCritical: true },
    { source: 2, target: 4, label: "C", duration: 4, isCritical: false },
    { source: 2, target: 3, label: "X", duration: 0, isCritical: false },
    { source: 3, target: 4, label: "D", duration: 5, isCritical: true },
    { source: 4, target: 5, label: "E", duration: 6, isCritical: true },
  ];

  // Fonction pour générer le tracé d'un arc entre deux nœuds
  const getPathBetweenNodes = (sourceId: number, targetId: number, isDashed: boolean): string => {
    const source = nodes.find(n => n.id === sourceId)!;
    const target = nodes.find(n => n.id === targetId)!;

    // Pour la tâche X (en pointillé), créer une ligne courbe
    if (isDashed) {
      return `M ${source.x} ${source.y} Q ${(source.x + target.x) / 2} ${(source.y + target.y) / 2 - 30}, ${target.x} ${target.y}`;
    }
    
    // Pour les autres arcs, créer une ligne droite
    return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  };

  // Fonction pour calculer la position de l'étiquette d'un arc
  const getLabelPosition = (sourceId: number, targetId: number, isDashed: boolean) => {
    const source = nodes.find(n => n.id === sourceId)!;
    const target = nodes.find(n => n.id === targetId)!;
    
    if (isDashed) {
      // Position pour l'arc X
      return {
        x: (source.x + target.x) / 2,
        y: (source.y + target.y) / 2 - 20
      };
    } else {
      // Position pour les autres arcs
      return {
        x: (source.x + target.x) / 2,
        y: (source.y + target.y) / 2 - 10
      };
    }
  };

  // Fonction pour calculer l'angle de rotation de la flèche
  const getArrowRotation = (sourceId: number, targetId: number, isDashed: boolean) => {
    const source = nodes.find(n => n.id === sourceId)!;
    const target = nodes.find(n => n.id === targetId)!;
    
    if (isDashed) {
      // Pour l'arc X (en pointillé), on utilise une rotation spécifique
      return 270;
    }
    
    // Pour les autres arcs, calculer l'angle entre source et target
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    return Math.atan2(dy, dx) * (180 / Math.PI);
  };

  // Rendu du diagramme PERT
  return (
    <div className="flex flex-col items-center w-full p-4">
      <h1 className="text-xl font-bold mb-4">Diagramme PERT enrichi</h1>
      <div className="border border-gray-300 rounded-lg p-4 bg-white">
        <svg width="700" height="450">
          {/* Flèches et étiquettes */}
          {edges.map((edge, index) => {
            const isDashed = edge.label === "X";
            const labelPos = getLabelPosition(edge.source, edge.target, isDashed);
            const arrowRotation = getArrowRotation(edge.source, edge.target, isDashed);
            
            return (
              <g key={`edge-${index}`}>
                {/* Tracé de l'arc */}
                <path
                  d={getPathBetweenNodes(edge.source, edge.target, isDashed)}
                  fill="none"
                  stroke={edge.isCritical ? "red" : "black"}
                  strokeWidth="1.5"
                  strokeDasharray={isDashed ? "4" : "none"}
                />
                
                {/* Flèche */}
                <g transform={`translate(${labelPos.x + 40}, ${labelPos.y}) rotate(${arrowRotation})`}>
                  <path
                    d="M -5,-3 L 0,0 L -5,3"
                    fill="none"
                    stroke={edge.isCritical ? "red" : "black"}
                    strokeWidth="1.5"
                  />
                </g>
                
                {/* Étiquette */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  fill={edge.isCritical ? "red" : "black"}
                  fontSize="12px"
                >
                  {`${edge.label}(${edge.duration})`}
                </text>
              </g>
            );
          })}
          
          {/* Nœuds */}
          {nodes.map((node) => (
            <g key={`node-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
              {/* Cercle du nœud */}
              <circle
                r="30"
                fill="white"
                stroke="black"
                strokeWidth="1"
              />
              
              {/* Ligne horizontale de séparation */}
              <line
                x1="-30"
                y1="0"
                x2="30"
                y2="0"
                stroke="black"
                strokeWidth="1"
              />
              
              {/* Date au plus tôt */}
              <text
                x="-10"
                y="-8"
                textAnchor="middle"
                fontSize="12px"
              >
                {node.earliest}
              </text>
              
              {/* Date au plus tard */}
              <text
                x="10"
                y="-8"
                textAnchor="middle"
                fontSize="12px"
              >
                {node.latest}
              </text>
              
              {/* Numéro du sommet */}
              <text
                y="13"
                textAnchor="middle"
                fontSize="12px"
              >
                {node.id}
              </text>
            </g>
          ))}
          
          {/* Bulles d'information */}
          {/* Date au plus tôt */}
          <g>
            <ellipse
              cx="165"
              cy="50"
              rx="60"
              ry="25"
              fill="white"
              stroke="black"
            />
            <text
              x="165"
              y="45"
              textAnchor="middle"
              fontSize="10px"
            >
              Date au plus
            </text>
            <text
              x="165"
              y="60"
              textAnchor="middle"
              fontSize="10px"
            >
              tôt
            </text>
            <line
              x1="180"
              y1="75"
              x2="235"
              y2="105"
              stroke="black"
              strokeWidth="1"
            />
          </g>
          
          {/* Date au plus tard */}
          <g>
            <ellipse
              cx="340"
              cy="50"
              rx="60"
              ry="25"
              fill="white"
              stroke="black"
            />
            <text
              x="340"
              y="45"
              textAnchor="middle"
              fontSize="10px"
            >
              Date au plus
            </text>
            <text
              x="340"
              y="60"
              textAnchor="middle"
              fontSize="10px"
            >
              tard
            </text>
            <line
              x1="320"
              y1="75"
              x2="265"
              y2="105"
              stroke="black"
              strokeWidth="1"
            />
          </g>
        </svg>
      </div>
      
      {/* Légende */}
      <div className="mt-4 text-sm">
        <p className="font-semibold mb-2">Légende:</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-20 h-20 relative border border-black rounded-full flex items-center justify-center">
              <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
                <div className="flex w-full justify-center">
                  <span className="mx-1">x</span>
                  <span className="mx-1">y</span>
                </div>
                <div className="border-t border-black w-full"></div>
                <span>n</span>
              </div>
            </div>
            <div>
              <p>x = date au plus tôt</p>
              <p>y = date au plus tard</p>
              <p>n = numéro du sommet</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-px w-16 bg-red-500 relative">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1 rotate-45 w-3 h-px bg-red-500"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1 -rotate-45 w-3 h-px bg-red-500"></div>
              </div>
            </div>
            <p>Chemin critique</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-px w-16 border-t border-dashed border-black relative">
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1 rotate-45 w-3 h-px bg-black"></div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1 -rotate-45 w-3 h-px bg-black"></div>
              </div>
            </div>
            <p>Tâche fictive</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PertV3;