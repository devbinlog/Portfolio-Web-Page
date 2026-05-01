interface WorkingMethodSectionProps {
  workingMethod: string
}

const DEFAULT_PRINCIPLES = [
  {
    title: '구조 중심 문제 해결',
    body: '문제를 기능 목록으로 보지 않고 서비스 구조로 분리합니다. 데이터 흐름과 역할 경계를 먼저 정의한 뒤 구현에 들어갑니다.',
    example: 'ex. BandStage — 공연·아티스트·장소·티켓을 4계층으로 분리해 구조화하고, 지역·날짜·장르 기준 탐색 흐름까지 함께 설계했습니다.',
  },
  {
    title: 'LLM 기반 설계',
    body: 'LLM을 단순 텍스트 생성기가 아니라 입력을 구조화하는 엔진으로 사용합니다. 프롬프트는 데이터 계약이며, 출력은 이후 파이프라인에서 재사용 가능한 스키마로 설계합니다.',
    example: 'ex. MDE — 자연어 입력을 DesignProfile로 변환하는 프롬프트를 설계해, 동일 구조체를 이미지 생성·검색·랭킹에 재사용했습니다.',
  },
  {
    title: '데이터와 경험의 통합',
    body: '데이터 처리 결과와 사용자 경험을 함께 설계합니다. 인식된 데이터가 어떤 피드백으로 이어져야 자연스러운지 실험하며 개선합니다.',
    example: 'ex. MUSE — 손동작 인식 결과를 사운드 제어 경험으로 연결하기 위해 화면 영역별 역할을 정의하고 실시간성과 안정성을 반복 개선했습니다.',
  },
  {
    title: '인터랙션 중심 시스템 설계',
    body: '사용자의 행동을 시스템 입력으로 정의하고, 인터랙션 흐름 전체를 설계합니다. UI 동작이 곧 데이터 탐색 구조가 되도록 연결합니다.',
    example: 'ex. Page of Artist — 3D 카드 인터페이스에서 이동·포커싱·선택 흐름을 설계해 인터랙션이 정보 탐색으로 이어지도록 구현했습니다.',
  },
]

export function WorkingMethodSection({ workingMethod }: WorkingMethodSectionProps) {
  return (
    <section aria-labelledby="working-method-heading">
      <h2
        id="working-method-heading"
        className="text-2xl font-bold text-text-primary mb-8"
      >
        Working Style
      </h2>

      <div className="grid gap-6 sm:grid-cols-2">
        {DEFAULT_PRINCIPLES.map((principle, i) => (
          <div
            key={i}
            className="p-5 rounded-lg border border-border-default bg-surface-elevated"
          >
            <h3 className="text-base font-semibold text-text-primary mb-2">
              {principle.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-3">
              {principle.body}
            </p>
            <p className="text-xs text-text-disabled leading-relaxed">
              {principle.example}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
