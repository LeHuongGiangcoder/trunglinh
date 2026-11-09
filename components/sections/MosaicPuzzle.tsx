"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

import { FLICKER_EVENT } from "@/components/ui/Motion";
import { motion } from "@/content/theme";

/**
 * Một mảnh ghép: chỗ nằm lúc đầu (`home`), ô trống nó phải lấp (`slot`), vị
 * trí ảnh lớn bên trong mảnh (`photo`, giống hệt cửa sổ của các ô trái tim) và
 * góc nghiêng khi còn nằm rời.
 */
export type PuzzlePiece = {
  home: CSSProperties;
  slot: CSSProperties;
  photo: CSSProperties;
  rotate: number;
  alt: string;
};

type Props = {
  pieces: PuzzlePiece[];
  src: string;
  sizes: string;
  /** Giá trị `data-flicker-group` của các ô sẽ nhấp nháy khi ghép xong. */
  group: string;
  hint: string;
  done: string;
  /** Chỗ đặt dòng gợi ý trên artboard. */
  hintAt: CSSProperties;
};

/** Thời gian mảnh trượt về chỗ, khớp `motion.durationBase` của theme. */
const SETTLE_MS = parseFloat(motion.durationBase);

/**
 * Hai mảnh ghép rời của trái tim. Kéo đúng mảnh vào ô trống của nó thì mảnh
 * hút vào chỗ; đủ cả hai thì phát FLICKER_EVENT để Motion cho các ô trái tim
 * nhấp nháy bật sáng như ô vuông ở hero.
 */
export function MosaicPuzzle({ pieces, src, sizes, group, hint, done, hintAt }: Props) {
  const [placed, setPlaced] = useState(() => pieces.map(() => false));
  const complete = placed.every(Boolean);

  useEffect(() => {
    if (!complete) return;
    window.dispatchEvent(new CustomEvent(FLICKER_EVENT, { detail: group }));
  }, [complete, group]);

  return (
    <>
      {pieces.map((piece, i) => (
        <Piece
          key={i}
          piece={piece}
          src={src}
          sizes={sizes}
          group={group}
          placed={placed[i]}
          onPlace={() => setPlaced((prev) => prev.map((v, j) => (j === i ? true : v)))}
        />
      ))}

      <p
        aria-live="polite"
        className="absolute text-center font-display text-poster-caption font-semibold text-taupe"
        style={hintAt}
      >
        {complete ? done : hint}
      </p>
    </>
  );
}

type Phase = "rest" | "drag" | "settle";

function Piece({
  piece,
  src,
  sizes,
  group,
  placed,
  onPlace,
}: {
  piece: PuzzlePiece;
  src: string;
  sizes: string;
  group: string;
  placed: boolean;
  onPlace: () => void;
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const pieceRef = useRef<HTMLButtonElement>(null);
  const start = useRef({ x: 0, y: 0 });
  const timer = useRef<number | undefined>(undefined);
  const [phase, setPhase] = useState<Phase>("rest");
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  /** Đang trượt vào ô trống (true) hay trượt về chỗ cũ (false). */
  const [snapping, setSnapping] = useState(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const settle = (to: { x: number; y: number }, intoSlot: boolean) => {
    setPhase("settle");
    setSnapping(intoSlot);
    setOffset(to);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setPhase("rest");
      setOffset({ x: 0, y: 0 });
      if (intoSlot) onPlace();
    }, SETTLE_MS);
  };

  /** Độ dời từ chỗ cũ tới ô trống, tính bằng tâm của hai hộp. */
  const toSlot = (current: { x: number; y: number }) => {
    const slot = slotRef.current?.getBoundingClientRect();
    const self = pieceRef.current?.getBoundingClientRect();
    if (!slot || !self) return null;
    const homeX = self.left + self.width / 2 - current.x;
    const homeY = self.top + self.height / 2 - current.y;
    return {
      x: slot.left + slot.width / 2 - homeX,
      y: slot.top + slot.height / 2 - homeY,
      slotWidth: slot.width,
    };
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (placed || phase === "settle") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { x: event.clientX, y: event.clientY };
    setPhase("drag");
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (phase !== "drag") return;
    setOffset({ x: event.clientX - start.current.x, y: event.clientY - start.current.y });
  };

  const onPointerUp = () => {
    if (phase !== "drag") return;
    const target = toSlot(offset);
    // Tâm mảnh lọt vào nửa ô trống là đủ — ngón tay trên điện thoại không chính xác tới từng px.
    if (target && Math.hypot(target.x - offset.x, target.y - offset.y) < target.slotWidth * 0.5) {
      settle(target, true);
    } else {
      settle({ x: 0, y: 0 }, false);
    }
  };

  const transform = placed
    ? undefined
    : phase === "drag"
      ? `translate(${offset.x}px, ${offset.y}px) scale(1.08)`
      : phase === "settle"
        ? `translate(${offset.x}px, ${offset.y}px) rotate(${snapping ? 0 : piece.rotate}deg)`
        : `rotate(${piece.rotate}deg)`;

  return (
    <>
      <div ref={slotRef} aria-hidden className="pointer-events-none absolute" style={piece.slot} />

      <div data-reveal className={`absolute ${phase === "rest" ? "" : "z-20"}`} style={placed ? piece.slot : piece.home}>
        <button
          ref={pieceRef}
          type="button"
          data-flicker-group={group}
          disabled={placed}
          aria-label={placed ? piece.alt : `${piece.alt} — kéo vào ô trống của trái tim`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => phase === "drag" && settle({ x: 0, y: 0 }, false)}
          onClick={(event) => {
            // Bàn phím (Enter/Space) không kéo được — cho ghép thẳng.
            if (event.detail !== 0 || placed) return;
            const target = toSlot({ x: 0, y: 0 });
            if (target) settle(target, true);
          }}
          className={[
            "relative block size-full touch-none select-none overflow-hidden rounded-tile",
            placed ? "cursor-default" : "cursor-grab active:cursor-grabbing",
            phase === "drag" ? "shadow-lift" : placed ? "" : "shadow-paper",
            phase === "settle" ? "transition-transform duration-(--t-duration-base) ease-glow" : "",
          ].join(" ")}
          style={{ transform }}
        >
          <span className="pointer-events-none absolute" style={piece.photo}>
            <Image src={src} alt="" fill sizes={sizes} draggable={false} className="object-cover" />
          </span>
        </button>
      </div>
    </>
  );
}
