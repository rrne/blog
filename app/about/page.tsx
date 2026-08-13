import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.author} — 프론트엔드 엔지니어`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[640px] px-5 pt-9 pb-12">
      <div className="prose">
      <h1 className="mb-2 text-[21px] font-bold text-ink-950">About</h1>

      <p>
        디자인과 구현 사이의 간극을 줄이는 프론트엔드 엔지니어입니다. 모션,
        여백, 타이포그래피 같은 디테일에 제 기준을 갖고, 한 화면을 잘 만드는
        데서 멈추지 않고 재사용할 수 있는 시스템으로 만드는 일을 좋아합니다.
        디자인 전공을 바탕으로 디자이너와 엔지니어 사이에서 소통하며, 
        디자인 시스템과 UI 컴포넌트 라이브러리를 구축하고 유지하는 일을 주로 합니다.
        (디발자라고 스스로를 부르고 싶어요😂)
      </p>

      <h2>관심사</h2>
      <ul>
        <li>디자인 시스템 — 반복되는 판단을 컴포넌트를 어떻게 시스템화 시킬까</li>
        <li>측정 우선 — 코드를 읽고 세운 가설이 실측에서 뒤집히는 순간들</li>
        <li>테스트코드 — 코드의 신뢰성을 높이기 위한 테스트 전략</li>
        <li>AI 시대의 만드는 방식 — 어디까지 맡기고 어디에 선을 그을지</li>
      </ul>

      <h2>이 블로그</h2>
      <p>
        글감 발굴과 초안 작성은 파이프라인이 맡고, 사실 검증과 발행은 사람이
        합니다. 글 대부분이 실무 이슈에서 나오기 때문에 발행 경로에 민감정보 검사를
        넣어뒀습니다. 자세한 구조는{" "}
        <a href={`${site.github}/blog`} target="_blank" rel="noreferrer">
          레포지토리
        </a>
        에 정리해뒀습니다.
      </p>

      <h2>연락</h2>
      <p>
        <a href={site.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </p>
      </div>
    </div>
  );
}
