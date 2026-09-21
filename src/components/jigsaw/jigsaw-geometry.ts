export type JigsawEdge = -1 | 0 | 1;

export type JigsawEdges = {
  top: JigsawEdge;
  right: JigsawEdge;
  bottom: JigsawEdge;
  left: JigsawEdge;
};

export type JigsawPieceDefinition = {
  id: number;
  row: number;
  column: number;
  edges: JigsawEdges;
  path: string;
  trayOrder: number;
  restingRotation: number;
};

export const JIGSAW_TAB_DEPTH = 0.2;

function signedEdge(seed: number): JigsawEdge {
  return ((seed * 17 + seed * seed * 3 + 11) % 2 === 0 ? 1 : -1) as JigsawEdge;
}

function topEdge(edge: JigsawEdge) {
  if (edge === 0) return "L 1 0";
  const y = -edge * JIGSAW_TAB_DEPTH;
  return `L .34 0 C .39 0 .38 ${y * 0.22} .41 ${y * 0.22} C .43 ${y * 0.22} .42 ${y} .5 ${y} C .58 ${y} .57 ${y * 0.22} .59 ${y * 0.22} C .62 ${y * 0.22} .61 0 .66 0 L 1 0`;
}

function rightEdge(edge: JigsawEdge) {
  if (edge === 0) return "L 1 1";
  const x = 1 + edge * JIGSAW_TAB_DEPTH;
  return `L 1 .34 C 1 .39 ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} .38 ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} .41 C ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} .43 ${x} .42 ${x} .5 C ${x} .58 ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} .57 ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} .59 C ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} .62 1 .61 1 .66 L 1 1`;
}

function bottomEdge(edge: JigsawEdge) {
  if (edge === 0) return "L 0 1";
  const y = 1 + edge * JIGSAW_TAB_DEPTH;
  return `L .66 1 C .61 1 .62 ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} .59 ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} C .57 ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} .58 ${y} .5 ${y} C .42 ${y} .43 ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} .41 ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} C .38 ${1 + edge * JIGSAW_TAB_DEPTH * 0.22} .39 1 .34 1 L 0 1`;
}

function leftEdge(edge: JigsawEdge) {
  if (edge === 0) return "L 0 0";
  const x = -edge * JIGSAW_TAB_DEPTH;
  return `L 0 .66 C 0 .61 ${-edge * JIGSAW_TAB_DEPTH * 0.22} .62 ${-edge * JIGSAW_TAB_DEPTH * 0.22} .59 C ${-edge * JIGSAW_TAB_DEPTH * 0.22} .57 ${x} .58 ${x} .5 C ${x} .42 ${-edge * JIGSAW_TAB_DEPTH * 0.22} .43 ${-edge * JIGSAW_TAB_DEPTH * 0.22} .41 C ${-edge * JIGSAW_TAB_DEPTH * 0.22} .38 0 .39 0 .34 L 0 0`;
}

export function createPiecePath(edges: JigsawEdges): string {
  return `M 0 0 ${topEdge(edges.top)} ${rightEdge(edges.right)} ${bottomEdge(edges.bottom)} ${leftEdge(edges.left)} Z`;
}

export function createJigsawPieces(rows: number, columns: number): JigsawPieceDefinition[] {
  const horizontalEdges = Array.from({ length: rows - 1 }, (_, row) =>
    Array.from({ length: columns }, (_, column) => signedEdge(row * columns + column + 23)),
  );
  const verticalEdges = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: columns - 1 }, (_, column) => signedEdge(row * (columns - 1) + column + 71)),
  );

  const pieces = Array.from({ length: rows * columns }, (_, id) => {
    const row = Math.floor(id / columns);
    const column = id % columns;
    const edges: JigsawEdges = {
      top: row === 0 ? 0 : (-horizontalEdges[row - 1][column]) as JigsawEdge,
      right: column === columns - 1 ? 0 : verticalEdges[row][column],
      bottom: row === rows - 1 ? 0 : horizontalEdges[row][column],
      left: column === 0 ? 0 : (-verticalEdges[row][column - 1]) as JigsawEdge,
    };

    return {
      id,
      row,
      column,
      edges,
      path: createPiecePath(edges),
      trayOrder: (id * 13 + 17) % (rows * columns),
      restingRotation: ((id * 7 + 3) % 11) - 5,
    };
  });

  assertValidJigsawGeometry(pieces, rows, columns);
  return pieces.sort((first, second) => first.trayOrder - second.trayOrder);
}

export function assertValidJigsawGeometry(
  pieces: readonly JigsawPieceDefinition[],
  rows: number,
  columns: number,
) {
  if (pieces.length !== rows * columns) throw new Error("Jigsaw geometry has an invalid piece count.");
  const byPosition = new Map(pieces.map((piece) => [`${piece.row}:${piece.column}`, piece]));

  for (const piece of pieces) {
    if ((piece.row === 0 && piece.edges.top !== 0) ||
        (piece.row === rows - 1 && piece.edges.bottom !== 0) ||
        (piece.column === 0 && piece.edges.left !== 0) ||
        (piece.column === columns - 1 && piece.edges.right !== 0)) {
      throw new Error(`Jigsaw piece ${piece.id} has a non-flat outside edge.`);
    }

    const right = byPosition.get(`${piece.row}:${piece.column + 1}`);
    const below = byPosition.get(`${piece.row + 1}:${piece.column}`);
    if (right && piece.edges.right !== -right.edges.left) throw new Error("Jigsaw horizontal neighbors do not complement each other.");
    if (below && piece.edges.bottom !== -below.edges.top) throw new Error("Jigsaw vertical neighbors do not complement each other.");
  }
}
