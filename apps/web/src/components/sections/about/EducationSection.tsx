export function EducationSection() {
  return (
    <section aria-labelledby="education-heading">
      <h2 id="education-heading" className="text-2xl font-bold text-text-primary mb-8">
        Education
      </h2>

      {/* 학력 */}
      <div className="mb-10 pb-10 border-b border-border-default">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
          <div>
            <span className="text-base font-semibold text-text-primary">Jeonju University</span>
            <span className="text-base text-text-secondary"> | 컴퓨터공학과(학사) — 졸업</span>
          </div>
          <span className="text-sm font-mono text-text-disabled">2020.03 — 2025.02</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-mono text-text-disabled uppercase tracking-widest">GPA</span>
          <span className="text-sm text-text-secondary">3.7 / 4.5</span>
        </div>
      </div>

      {/* Leadership & Activities */}
      <div className="mb-10 pb-10 border-b border-border-default">
        <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mb-6">
          Leadership &amp; Activities
        </p>
        <div className="space-y-5">
          {[
            { role: '학회장', org: '컴퓨터공학과', period: '2024.01 — 2025.01' },
            { role: '연구실장', org: 'CNS 연구실', period: '2023.01 — 2024.01' },
            { role: '컴퓨터공학과 학생회 활동', org: '', period: '2020.03 — 2025.01' },
            { role: '컴퓨터공학과 CNS 연구실 연구원 활동', org: '', period: '2020.03 — 2025.01' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <div>
                <span className="text-sm text-text-primary">{item.role}</span>
                {item.org && (
                  <span className="text-sm text-text-disabled"> | {item.org}</span>
                )}
              </div>
              <span className="text-xs font-mono text-text-disabled">{item.period}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Awards */}
      <div>
        <p className="text-xs font-mono text-text-disabled uppercase tracking-widest mb-6">
          Awards
        </p>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div>
            <p className="text-sm text-text-primary">2023 디지털 창의인재 경진대회 우수상</p>
            <p className="text-sm text-text-disabled mt-0.5">전주대학교</p>
            <p className="text-sm text-text-secondary mt-2">Lyricst</p>
            <p className="text-xs text-text-disabled mt-0.5">팀장 / 기획 / 프론트엔드</p>
            <p className="text-xs text-text-disabled mt-1.5 whitespace-nowrap">음악을 듣는 경험에서 확장하여 가사 감정/스토리에 몰입하는 스트리밍 UX를 제안한 웹 프로토타입</p>
          </div>
        </div>
      </div>
    </section>
  )
}
