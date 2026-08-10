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
        숙박 예약 플랫폼에서 고객 앱과 운영 어드민을 만드는 프론트엔드
        엔지니어입니다. 화면에 문제가 보이면 API와 데이터까지 파고들어 근본
        원인을 찾는 일을 좋아합니다.
      </p>

      <h2>관심사</h2>
      <ul>
        <li>조용한 실패 — 에러 없이 화면에서 사라지는 버그를 어떻게 드러낼지</li>
        <li>측정 우선 — 코드를 읽고 세운 가설이 실측에서 뒤집히는 순간들</li>
        <li>WebGL·3D 인터랙션 — 셰이더와 React Three Fiber로 하는 실험들</li>
        <li>AI에 유지보수를 위임할 때 어디에 선을 그어야 하는지</li>
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
