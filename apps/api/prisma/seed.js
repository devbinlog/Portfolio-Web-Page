"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding database...');
    // 카테고리
    const musicCategory = await prisma.category.upsert({
        where: { slug: 'music_projects' },
        update: {},
        create: {
            name: 'Music Projects',
            slug: 'music_projects',
            objectFamily: 'signal_orb',
            order: 1,
        },
    });
    const aiCategory = await prisma.category.upsert({
        where: { slug: 'ai_projects' },
        update: {},
        create: {
            name: 'AI Projects',
            slug: 'ai_projects',
            objectFamily: 'data_crystal',
            order: 2,
        },
    });
    const designCategory = await prisma.category.upsert({
        where: { slug: 'design_projects' },
        update: {},
        create: {
            name: 'Design Projects',
            slug: 'design_projects',
            objectFamily: 'layered_device',
            order: 3,
        },
    });
    // 태그
    const tags = await Promise.all([
        prisma.tag.upsert({ where: { slug: 'react' }, update: {}, create: { name: 'React', slug: 'react' } }),
        prisma.tag.upsert({ where: { slug: 'nextjs' }, update: {}, create: { name: 'Next.js', slug: 'nextjs' } }),
        prisma.tag.upsert({ where: { slug: 'typescript' }, update: {}, create: { name: 'TypeScript', slug: 'typescript' } }),
        prisma.tag.upsert({ where: { slug: 'nestjs' }, update: {}, create: { name: 'NestJS', slug: 'nestjs' } }),
        prisma.tag.upsert({ where: { slug: 'ai' }, update: {}, create: { name: 'AI', slug: 'ai' } }),
    ]);
    const [reactTag, nextjsTag, typescriptTag, nestjsTag, aiTag] = tags;
    // 프로필
    await prisma.profile.upsert({
        where: { id: 'default' },
        update: {},
        create: {
            id: 'default',
            name: 'Taebin Kim',
            roleTitle: 'Frontend Developer',
            tagline: 'Building imagination through structure and interaction.',
            bio: '구조와 인터랙션으로 상상을 현실로 만드는 프론트엔드 개발자입니다. 음악, AI, 디자인 교차점에서 의미 있는 디지털 경험을 만들어갑니다.',
            workingMethod: `문제를 기능 단위가 아닌 구조적으로 분해합니다.
구현 전에 문서와 아키텍처를 정의합니다.
데이터 구조와 사용자 경험을 함께 설계합니다.
배포, 유지보수, 운영을 처음부터 고려합니다.`,
            location: 'Seoul, Korea',
            socialLinks: {
                create: [
                    { platform: 'GitHub', url: 'https://github.com/taebinkim', order: 1 },
                ],
            },
        },
    });
    // 대표 프로젝트 — BandStage
    const bandstage = await prisma.project.upsert({
        where: { slug: 'bandstage' },
        update: {},
        create: {
            title: 'BandStage',
            slug: 'bandstage',
            summary: '음악인과 팬을 연결하는 공연 플랫폼',
            description: `BandStage는 음악인과 팬을 연결하는 공연 정보 및 예매 플랫폼입니다.

음악인이 공연을 등록하고 홍보할 수 있으며, 팬은 관심 아티스트의 공연을 탐색하고 예매할 수 있습니다.

반응형 UI와 실시간 좌석 선택 기능을 구현하여 사용자 경험을 개선했습니다.`,
            categoryId: musicCategory.id,
            secondaryCategoryId: designCategory.id,
            year: 2024,
            role: '프론트엔드 개발',
            contribution: '전체 프론트엔드 아키텍처 설계 및 구현. 공연 목록, 상세 페이지, 예매 플로우 개발.',
            techStack: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'NestJS'],
            keyLearnings: '실시간 좌석 상태 동기화 구현 과정에서 WebSocket과 Optimistic Update의 트레이드오프를 학습했습니다.',
            workingApproach: '컴포넌트 계층 설계 → API 스펙 정의 → 구현 순서로 진행했습니다.',
            isFeatured: true,
            featuredOrder: 1,
            isPublished: true,
            media: {
                create: [
                    {
                        type: 'VIDEO_PLACEHOLDER',
                        placeholderLabel: '데모 영상 준비 중입니다',
                        order: 1,
                        isPlaceholder: true,
                    },
                ],
            },
            documents: {
                create: [
                    {
                        type: 'REPORT',
                        title: '프로젝트 최종 보고서',
                        placeholderLabel: '보고서 업로드 예정입니다',
                        order: 1,
                        isPlaceholder: true,
                    },
                ],
            },
            links: {
                create: [
                    { type: 'GITHUB', label: 'GitHub', url: 'https://github.com/taebinkim/bandstage', order: 1 },
                ],
            },
        },
    });
    await prisma.projectTag.createMany({
        data: [
            { projectId: bandstage.id, tagId: reactTag.id },
            { projectId: bandstage.id, tagId: nextjsTag.id },
            { projectId: bandstage.id, tagId: typescriptTag.id },
        ],
        skipDuplicates: true,
    });
    // 대표 프로젝트 — PageOfArtist
    const pageofartist = await prisma.project.upsert({
        where: { slug: 'pageofartist' },
        update: {},
        create: {
            title: 'PageOfArtist',
            slug: 'pageofartist',
            summary: '아티스트 개인 페이지 구축 플랫폼',
            description: `PageOfArtist는 음악인이 자신만의 개인 페이지를 손쉽게 구축할 수 있는 플랫폼입니다.

템플릿 기반으로 아티스트 프로필, 음악, 공연 일정을 구성하고 팬과 소통할 수 있습니다.`,
            categoryId: musicCategory.id,
            secondaryCategoryId: designCategory.id,
            year: 2024,
            role: '풀스택 개발',
            contribution: '프론트엔드 전체 및 백엔드 API 설계 참여',
            techStack: ['React', 'Next.js', 'TypeScript', 'NestJS', 'PostgreSQL'],
            keyLearnings: '멀티 테넌트 아키텍처 설계와 동적 도메인 라우팅을 구현하며 DNS 및 서브도메인 처리를 학습했습니다.',
            isFeatured: true,
            featuredOrder: 2,
            isPublished: true,
            media: {
                create: [
                    {
                        type: 'VIDEO_PLACEHOLDER',
                        placeholderLabel: '데모 영상 준비 중입니다',
                        order: 1,
                        isPlaceholder: true,
                    },
                ],
            },
            links: {
                create: [
                    { type: 'GITHUB', label: 'GitHub', url: 'https://github.com/taebinkim/pageofartist', order: 1 },
                ],
            },
        },
    });
    await prisma.projectTag.createMany({
        data: [
            { projectId: pageofartist.id, tagId: nextjsTag.id },
            { projectId: pageofartist.id, tagId: typescriptTag.id },
            { projectId: pageofartist.id, tagId: nestjsTag.id },
        ],
        skipDuplicates: true,
    });
    // 대표 프로젝트 — MUSE
    const muse = await prisma.project.upsert({
        where: { slug: 'muse' },
        update: {},
        create: {
            title: 'MUSE',
            slug: 'muse',
            summary: 'AI 기반 음악 추천 및 큐레이션 서비스',
            description: `MUSE는 사용자의 청취 패턴과 감정 상태를 분석하여 개인화된 음악을 추천하는 AI 기반 서비스입니다.

자연어로 원하는 분위기를 입력하면 AI가 적합한 음악을 큐레이션합니다.`,
            categoryId: musicCategory.id,
            secondaryCategoryId: aiCategory.id,
            year: 2024,
            role: '프론트엔드 개발, AI 통합',
            contribution: '추천 UI 구현 및 AI API 통합, 사용자 청취 히스토리 분석 모듈 개발',
            techStack: ['React', 'TypeScript', 'Python', 'OpenAI API', 'PostgreSQL'],
            keyLearnings: 'AI API의 스트리밍 응답 처리와 프론트엔드 실시간 업데이트 연결 방법을 학습했습니다.',
            isFeatured: true,
            featuredOrder: 3,
            isPublished: true,
            media: {
                create: [
                    {
                        type: 'VIDEO_PLACEHOLDER',
                        placeholderLabel: '데모 영상 준비 중입니다',
                        order: 1,
                        isPlaceholder: true,
                    },
                ],
            },
            links: {
                create: [
                    { type: 'GITHUB', label: 'GitHub', url: 'https://github.com/taebinkim/muse', order: 1 },
                ],
            },
        },
    });
    await prisma.projectTag.createMany({
        data: [
            { projectId: muse.id, tagId: reactTag.id },
            { projectId: muse.id, tagId: typescriptTag.id },
            { projectId: muse.id, tagId: aiTag.id },
        ],
        skipDuplicates: true,
    });
    // 관리자 계정 (개발용)
    const adminPasswordHash = await bcrypt.hash('admin1234!', 12);
    await prisma.adminUser.upsert({
        where: { email: 'admin@taebinkim.com' },
        update: {},
        create: {
            email: 'admin@taebinkim.com',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
            isActive: true,
        },
    });
    console.log('Seed complete.');
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map