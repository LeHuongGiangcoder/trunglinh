"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { motion } from "@/content/theme";

gsap.registerPlugin(ScrollTrigger);

/** Sự kiện phát ra khi khách bấm "Mở thiệp" — ExperienceProvider bắn ra. */
export const OPEN_EVENT = "glow:open";

/**
 * Toàn bộ chuyển động của trang, gom vào một chỗ:
 *
 *   [data-reveal]        hiện dần khi cuộn tới (một batch cho cả trang)
 *   [data-parallax="N"]  trôi chậm hơn trang N% khi cuộn
 *   [data-hero]          hiện khi thiệp được mở, không chờ cuộn
 *   data-reveal-style="wipe"   (cùng data-reveal) hiện bằng vệt mềm trái → phải, cần .wipe-mask
 *   data-reveal-delay="ms"     trễ, cho cả cuộn tới lẫn cú mở thiệp
 *   [data-flicker]       nhấp nháy hiện lên khi thiệp mở, rồi thỉnh thoảng chớp lại
 *   [data-spin="N"]      xoay tròn mãi, N giây một vòng (đĩa than)
 *   [data-scene]         một cảnh chạy theo thanh cuộn (scrub), từ "start" tới "end":
 *       data-scene-start / data-scene-end   mốc ScrollTrigger, mặc định "top 85%" / "center 45%"
 *       [data-scene-x="N"] / [data-scene-y="N"]   con trôi tới xPercent / yPercent N
 *       [data-scene-wipe]                         con hiện theo vệt trái → phải (cần .wipe-mask)
 *
 * Section chỉ cần gắn attribute, không section nào tự gọi GSAP — nhờ vậy
 * chúng vẫn là server component và không có hai hệ animation chạy song song.
 */
export function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Ai tắt hiệu ứng thì hiện hết ngay, không dựng trigger nào.
    if (reduce) {
      gsap.set("[data-reveal], [data-flicker]", { opacity: 1 });
      // Cảnh cuộn: đặt thẳng về khung cuối, không trôi.
      for (const node of gsap.utils.toArray<HTMLElement>("[data-scene] [data-scene-x], [data-scene] [data-scene-y]")) {
        gsap.set(node, { xPercent: Number(node.dataset.sceneX ?? 0), yPercent: Number(node.dataset.sceneY ?? 0) });
      }
      return;
    }

    /* Hiện bằng một vệt mềm trái → phải — node cần class .wipe-mask. */
    const wipe = (node: HTMLElement, delay: number) =>
      gsap.fromTo(
        node,
        { opacity: 1, "--wipe": "0%", filter: "blur(6px)", y: 10 },
        {
          "--wipe": "140%",
          filter: "blur(0px)",
          y: 0,
          duration: 2.2,
          ease: "power2.inOut",
          delay,
          overwrite: "auto",
          clearProps: "filter",
        },
      );

    const ctx = gsap.context(() => {
      ScrollTrigger.batch("[data-reveal]:not([data-hero])", {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          for (const node of batch as HTMLElement[]) {
            const delay = Number(node.dataset.revealDelay ?? 0) / 1000;
            if (node.dataset.revealStyle === "wipe") {
              wipe(node, delay);
              continue;
            }
            gsap.fromTo(
              node,
              { opacity: 0, y: motion.revealDistance },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out",
                delay,
                overwrite: "auto",
              },
            );
          }
        },
      });

      for (const node of gsap.utils.toArray<HTMLElement>("[data-spin]")) {
        gsap.to(node, {
          rotation: 360,
          duration: Number(node.dataset.spin) || 12,
          ease: "none",
          repeat: -1,
        });
      }

      /* Cảnh theo cuộn: mọi con chung một timeline nên luôn khớp nhịp với nhau. */
      for (const scene of gsap.utils.toArray<HTMLElement>("[data-scene]")) {
        const tl = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            trigger: scene,
            start: scene.dataset.sceneStart ?? "top 85%",
            end: scene.dataset.sceneEnd ?? "center 45%",
            scrub: 0.8,
          },
        });

        for (const node of scene.querySelectorAll<HTMLElement>("[data-scene-x], [data-scene-y]")) {
          tl.fromTo(
            node,
            { xPercent: 0, yPercent: 0 },
            {
              xPercent: Number(node.dataset.sceneX ?? 0),
              yPercent: Number(node.dataset.sceneY ?? 0),
              ease: "sine.inOut",
            },
            0,
          );
        }

        for (const node of scene.querySelectorAll<HTMLElement>("[data-scene-wipe]")) {
          tl.fromTo(node, { "--wipe": "0%" }, { "--wipe": "140%", ease: "sine.inOut" }, 0);
        }
      }

      for (const node of gsap.utils.toArray<HTMLElement>("[data-parallax]")) {
        gsap.to(node, {
          yPercent: -Number(node.dataset.parallax),
          ease: "none",
          scrollTrigger: {
            trigger: node.closest("section") ?? node,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    });

    /*
      Hero nằm ngay dưới màn mở thiệp nên không bao giờ "cuộn tới" — nó hiện
      theo chính cú chạm mở thiệp. Nếu trang không có màn mở thiệp thì
      ExperienceProvider bắn sự kiện này ngay khi mount.
    */
    const onOpen = () => {
      ctx.add(() => {
        gsap.utils.toArray<HTMLElement>("[data-hero]").forEach((node, i) => {
          const delay =
            node.dataset.revealDelay !== undefined
              ? Number(node.dataset.revealDelay) / 1000
              : 0.15 + i * motion.revealStagger;

          if (node.dataset.revealStyle === "wipe") {
            wipe(node, delay);
            return;
          }

          gsap.fromTo(
            node,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay, overwrite: "auto" },
          );
        });

        /* Ô vuông: chớp vài nhịp rồi đứng yên ở opacity 1, so le ngẫu nhiên.
           Sau đó mỗi ô thỉnh thoảng chớp lại một nhịp ngắn cho trang có hơi thở. */
        gsap.utils.toArray<HTMLElement>("[data-flicker]").forEach((node) => {
          const delay = gsap.utils.random(0, 0.9);
          gsap
            .timeline({ delay })
            .to(node, { keyframes: { opacity: [0, 1, 0.15, 1, 0.45, 1] }, duration: 0.9, ease: "none" })
            .to(node, {
              keyframes: { opacity: [1, 0.2, 1] },
              duration: 0.45,
              ease: "none",
              repeat: -1,
              repeatDelay: gsap.utils.random(3.5, 7),
              delay: gsap.utils.random(1.5, 4),
            });
        });
      });
      ScrollTrigger.refresh();
    };

    window.addEventListener(OPEN_EVENT, onOpen);

    return () => {
      window.removeEventListener(OPEN_EVENT, onOpen);
      ctx.revert();
    };
  }, []);

  return null;
}
