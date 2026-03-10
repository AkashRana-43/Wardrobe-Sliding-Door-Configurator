import { useEffect, useState } from 'react';
import { useWardrobeState } from '@/state/useWardrobeContext';
import { slidingDoorService } from '@/services/slidingDoorService';
import type {
  WardrobeDoorMelamineColour,
  WardrobeDoorInsert,
  WardrobeStilesAndTracks,
} from '@/domain/models/slidingDoorConfig';
import styles from './WardrobePreview.module.css';

// ─── SVG layout constants ─────────────────────────────────────────────────────

const SVG_W         = 800;   // viewBox width
const SVG_H         = 500;   // viewBox height
const FRAME_X       = 60;    // left margin inside viewBox
const FRAME_Y       = 40;    // top margin
const FRAME_W       = SVG_W - FRAME_X * 2;
const FRAME_H       = SVG_H - FRAME_Y * 2;
const TRACK_H       = 14;    // top + bottom track height
const END_PANEL_W   = 20;    // end panel thickness
const STILE_W       = 8;     // vertical stile between doors
const INNER_MARGIN  = 12;    // insert inset from door edge
const FRAME_RADIUS  = 4;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hasLeftEndPanel(typeId: string | null): boolean {
  return typeId === 'END_PANEL_TO_WALL' || typeId === 'END_PANEL_TO_END_PANEL';
}

function hasRightEndPanel(typeId: string | null): boolean {
  return typeId === 'WALL_TO_END_PANEL' || typeId === 'END_PANEL_TO_END_PANEL';
}

// ─── Empty placeholder ────────────────────────────────────────────────────────

function EmptyPreview() {
  return (
    <div className={styles.placeholder}>
      <svg
        width="80" height="80" viewBox="0 0 80 80"
        fill="none" aria-hidden="true"
      >
        {/* Outer frame */}
        <rect x="8" y="8" width="64" height="64" rx="3"
          stroke="#d9d9d9" strokeWidth="2" fill="#f5f5f5" />
        {/* Top track */}
        <rect x="8" y="8" width="64" height="6" rx="2" fill="#e8e8e8" />
        {/* Bottom track */}
        <rect x="8" y="66" width="64" height="6" rx="2" fill="#e8e8e8" />
        {/* Door divider */}
        <line x1="40" y1="14" x2="40" y2="66" stroke="#d9d9d9" strokeWidth="2" />
      </svg>
      <p className={styles.placeholderText}>
        Configure your wardrobe to see a preview
      </p>
    </div>
  );
}

// ─── WardrobePreview ──────────────────────────────────────────────────────────

export default function WardrobePreview() {
  const { state } = useWardrobeState();

  const [colours, setColours] = useState<WardrobeDoorMelamineColour[]>([]);
  const [inserts, setInserts] = useState<WardrobeDoorInsert[]>([]);
  const [stiles,  setStiles]  = useState<WardrobeStilesAndTracks[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      slidingDoorService.getWardrobeDoorMelamineColours(),
      slidingDoorService.getWardrobeDoorInserts(),
      slidingDoorService.getWardrobeStilesAndTracks(),
    ]).then(([c, i, s]) => {
      if (!cancelled) {
        setColours(c);
        setInserts(i);
        setStiles(s);
      }
    });
    return () => { cancelled = true; };
  }, []);

  // ── Nothing configured yet ─────────────────────────────────────────
  if (!state.wardrobeTypeId && !state.wardrobeDoorCount) {
    return (
      <div className={styles.root}>
        <EmptyPreview />
      </div>
    );
  }

  // ── Lookup selected options ────────────────────────────────────────
  const selectedColour = colours.find(c => c.id === state.wardrobeDoorMelamineColourId);
  const selectedStiles = stiles.find(s => s.id === state.wardrobeStilesAndTracksId);

  const stilesColour   = selectedStiles?.colour ?? '#C0C0C0';
  const doorFill       = selectedColour?.hexPreview ?? '#f0f0f0';
  const doorCount      = state.wardrobeDoorCount ?? 2;
  const typeId         = state.wardrobeTypeId;

  const leftPanel  = hasLeftEndPanel(typeId);
  const rightPanel = hasRightEndPanel(typeId);

  // ── Calculate door geometry ────────────────────────────────────────
  const leftOffset  = leftPanel  ? END_PANEL_W : 0;
  const rightOffset = rightPanel ? END_PANEL_W : 0;

  const doorAreaX = FRAME_X + leftOffset;
  const doorAreaW = FRAME_W - leftOffset - rightOffset;
  const doorAreaY = FRAME_Y + TRACK_H;
  const doorAreaH = FRAME_H - TRACK_H * 2;

  // Total stile widths between doors
  const totalStilesW = STILE_W * (doorCount - 1);
  const singleDoorW  = (doorAreaW - totalStilesW) / doorCount;

  const doors = Array.from({ length: doorCount }, (_, i) => {
    const x = doorAreaX + i * (singleDoorW + STILE_W);
    const doorConfig = state.wardrobeDoorConfigurations.find(d => d.doorIndex === i);
    const insert = inserts.find(ins => ins.id === doorConfig?.insertId);
    return { x, insert };
  });

  // ── Dimension label ────────────────────────────────────────────────
  const dimLabel = state.wardrobeDimensions
    ? `${state.wardrobeDimensions.widthMm}mm × ${state.wardrobeDimensions.heightMm}mm`
    : null;

  return (
    <div className={styles.root}>
      <div className={styles.svgWrap}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Wardrobe preview"
          role="img"
        >
          <defs>
            {/* Clip path for the full door area */}
            <clipPath id="door-area-clip">
              <rect
                x={FRAME_X} y={FRAME_Y}
                width={FRAME_W} height={FRAME_H}
                rx={FRAME_RADIUS}
              />
            </clipPath>

            {/* Per-door insert clip paths */}
            {doors.map((door, i) => (
              <clipPath key={i} id={`insert-clip-${i}`}>
                <rect
                  x={door.x + INNER_MARGIN}
                  y={doorAreaY + INNER_MARGIN}
                  width={singleDoorW - INNER_MARGIN * 2}
                  height={doorAreaH - INNER_MARGIN * 2}
                />
              </clipPath>
            ))}
          </defs>

          {/* ── Outer frame background ─────────────────────────────── */}
          <rect
            x={FRAME_X} y={FRAME_Y}
            width={FRAME_W} height={FRAME_H}
            rx={FRAME_RADIUS}
            fill="#e8e8e8"
            stroke={stilesColour}
            strokeWidth="2"
          />

          {/* ── Door panels ────────────────────────────────────────── */}
          {doors.map((door, i) => (
            <g key={i}>
              {/* Door base fill (melamine colour) */}
              <rect
                x={door.x}
                y={doorAreaY}
                width={singleDoorW}
                height={doorAreaH}
                fill={doorFill}
              />

              {/* Insert image (if selected) */}
              {door.insert && (
                <image
                  href={door.insert.image}
                  x={door.x + INNER_MARGIN}
                  y={doorAreaY + INNER_MARGIN}
                  width={singleDoorW - INNER_MARGIN * 2}
                  height={doorAreaH - INNER_MARGIN * 2}
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#insert-clip-${i})`}
                />
              )}

              {/* Door border */}
              <rect
                x={door.x}
                y={doorAreaY}
                width={singleDoorW}
                height={doorAreaH}
                fill="none"
                stroke={stilesColour}
                strokeWidth="1.5"
                opacity="0.5"
              />
            </g>
          ))}

          {/* ── Stile dividers between doors ───────────────────────── */}
          {doors.slice(0, -1).map((door, i) => (
            <rect
              key={i}
              x={door.x + singleDoorW}
              y={doorAreaY}
              width={STILE_W}
              height={doorAreaH}
              fill={stilesColour}
            />
          ))}

          {/* ── Top track ──────────────────────────────────────────── */}
          <rect
            x={FRAME_X} y={FRAME_Y}
            width={FRAME_W} height={TRACK_H}
            rx={FRAME_RADIUS}
            fill={stilesColour}
          />

          {/* ── Bottom track ───────────────────────────────────────── */}
          <rect
            x={FRAME_X}
            y={FRAME_Y + FRAME_H - TRACK_H}
            width={FRAME_W}
            height={TRACK_H}
            rx={0}
            fill={stilesColour}
          />

          {/* ── Left end panel ─────────────────────────────────────── */}
          {leftPanel && (
            <rect
              x={FRAME_X}
              y={FRAME_Y + TRACK_H}
              width={END_PANEL_W}
              height={FRAME_H - TRACK_H * 2}
              fill={stilesColour}
            />
          )}

          {/* ── Right end panel ────────────────────────────────────── */}
          {rightPanel && (
            <rect
              x={FRAME_X + FRAME_W - END_PANEL_W}
              y={FRAME_Y + TRACK_H}
              width={END_PANEL_W}
              height={FRAME_H - TRACK_H * 2}
              fill={stilesColour}
            />
          )}

          {/* ── Outer frame border on top ──────────────────────────── */}
          <rect
            x={FRAME_X} y={FRAME_Y}
            width={FRAME_W} height={FRAME_H}
            rx={FRAME_RADIUS}
            fill="none"
            stroke={stilesColour}
            strokeWidth="2.5"
          />

          {/* ── Dimension arrows (if dimensions set) ───────────────── */}
          {state.wardrobeDimensions && (
            <g opacity="0.5">
              {/* Width arrow */}
              <line
                x1={FRAME_X} y1={FRAME_Y + FRAME_H + 20}
                x2={FRAME_X + FRAME_W} y2={FRAME_Y + FRAME_H + 20}
                stroke="#8c8c8c" strokeWidth="1"
                markerStart="url(#arrow)" markerEnd="url(#arrow)"
              />
              <text
                x={FRAME_X + FRAME_W / 2}
                y={FRAME_Y + FRAME_H + 36}
                textAnchor="middle"
                fontSize="11"
                fill="#8c8c8c"
                fontFamily="Inter, sans-serif"
              >
                {state.wardrobeDimensions.widthMm}mm
              </text>

              {/* Height arrow */}
              <line
                x1={FRAME_X - 20} y1={FRAME_Y}
                x2={FRAME_X - 20} y2={FRAME_Y + FRAME_H}
                stroke="#8c8c8c" strokeWidth="1"
              />
              <text
                x={FRAME_X - 28}
                y={FRAME_Y + FRAME_H / 2}
                textAnchor="middle"
                fontSize="11"
                fill="#8c8c8c"
                fontFamily="Inter, sans-serif"
                transform={`rotate(-90, ${FRAME_X - 28}, ${FRAME_Y + FRAME_H / 2})`}
              >
                {state.wardrobeDimensions.heightMm}mm
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* ── Dimension label below ──────────────────────────────────── */}
      {dimLabel && (
        <p className={styles.dimensionLabel}>{dimLabel}</p>
      )}
    </div>
  );
}