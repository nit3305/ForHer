import { JIGSAW_TAB_DEPTH, type JigsawPieceDefinition } from "./jigsaw-geometry";

type JigsawPieceGraphicProps = {
  piece: JigsawPieceDefinition;
  rows: number;
  columns: number;
  imageSrc?: string;
  instance: string;
  outlineOnly?: boolean;
  highlighted?: boolean;
  seamsVisible?: boolean;
};

export function JigsawPieceGraphic({
  piece,
  rows,
  columns,
  imageSrc,
  instance,
  outlineOnly = false,
  highlighted = false,
  seamsVisible = true,
}: JigsawPieceGraphicProps) {
  const clipId = `jigsaw-clip-${instance}-${piece.id}`;
  const viewBox = `${-JIGSAW_TAB_DEPTH} ${-JIGSAW_TAB_DEPTH} ${1 + JIGSAW_TAB_DEPTH * 2} ${1 + JIGSAW_TAB_DEPTH * 2}`;

  return (
    <svg viewBox={viewBox} className="size-full overflow-visible" aria-hidden="true">
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path d={piece.path} />
        </clipPath>
      </defs>
      {outlineOnly ? (
        <path
          d={piece.path}
          fill={highlighted ? "rgba(255,239,189,.42)" : "rgba(255,250,245,.22)"}
          stroke={highlighted ? "rgba(127,57,72,.62)" : "rgba(127,57,72,.26)"}
          strokeWidth={highlighted ? ".028" : ".02"}
          vectorEffect="non-scaling-stroke"
        />
      ) : (
        <>
          <g clipPath={`url(#${clipId})`}>
            <rect x={-piece.column} y={-piece.row} width={columns} height={rows} fill="#ecd0d0" />
            {imageSrc && (
              <image
                href={imageSrc}
                x={-piece.column}
                y={-piece.row}
                width={columns}
                height={rows}
                preserveAspectRatio="none"
              />
            )}
          </g>
          <path
            d={piece.path}
            fill="none"
            stroke={seamsVisible ? "rgba(255,250,245,.68)" : "rgba(255,250,245,0)"}
            strokeWidth=".014"
            vectorEffect="non-scaling-stroke"
            className="transition-[stroke] duration-700"
          />
        </>
      )}
    </svg>
  );
}
