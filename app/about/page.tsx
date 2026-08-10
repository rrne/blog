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
        화면에 어색함이 보이면 그 너머의 데이터까지 파고들어 근본 원인을
        찾습니다.
      </p>

      <h2>관심사</h2>
      <ul>
        <li>디자인 시스템 — 반복되는 판단을 컴포넌트와 토큰에 쌓는 일</li>
        <li>조용한 실패 — 에러 없이 화면에서 사라지는 버그를 어떻게 드러낼지</li>
        <li>측정 우선 — 코드를 읽고 세운 가설이 실측에서 뒤집히는 순간들</li>
        <li>WebGL·3D 인터랙션 — 셰이더와 React Three Fiber로 하는 실험들</li>
        <li>AI 시대의 만드는 방식 — 어디까지 맡기고 어디에 선을 그을지</li>
      </ul>

      <h2>이 블로그</h2>
      <p>
        글감 발굴과 초안 작성은 파이프라인이 맡고, 사실 검증과 발행은 사람이
        합니다. 글 대부분이 실무 이슈에서 나오기 때문에 발행 경로에 민감정보 검사를
        넣어뒀습니다. 자세한 구조는{" "}
        <a href={`${site.github}/blog`} target="_blank" rel="noreferrer">
          리포지토리
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
