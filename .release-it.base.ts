import type { Config } from 'release-it';
import type { Commit } from 'conventional-commits-parser';
import type { Options as WriterOptions } from 'conventional-changelog-writer';
import type * as GitRawCommits from 'git-raw-commits';
import type { Config as PresetConfig } from 'conventional-changelog-config-spec';

const baseConfig = (name: string): Config => ({
  plugins: {
    "release-it-pnpm": {
      // Disable the release step here to skip changelogithub and use `conventional-changelog` instead.
      disableRelease: true,
    },
    "@release-it/conventional-changelog": {
      infile: false,
      // This mimics changelogithub categories/emojis
      preset: {
        name: "conventionalcommits",
        types: [
          { type: "feat", section: "🚀 Features" },
          { type: "fix", section: "🐞 Bug Fixes" },
          { type: "perf", section: "🏎 Performance" },
          { type: "chore", section: "🏡 Other Changes" },
          { type: "docs", section: "🏡 Other Changes" },
          { type: "refactor", section: "🏡 Other Changes" },
          { type: "test", section: "🏡 Other Changes" },
          { type: "ci", section: "🏡 Other Changes" },
          { type: "style", section: "🏡 Other Changes" },
          { type: "build", section: "🏡 Other Changes" },
          { type: "revert", section: "🏡 Other Changes" },
          { type: "ops", section: "🏡 Other Changes" },
        ],
      } satisfies PresetConfig & { name: string },
      // This maps the breaking change (eg. `!` like `feat!: ...`) section to your custom title
      presetConfig: {
        header: "🚨 Breaking Changes",
        issueUrlFormat: "https://github.com{{host}}/{{owner}}/{{repository}}/issues/{{id}}",
        commitUrlFormat: "https://github.com{{host}}/{{owner}}/{{repository}}/commit/{{hash}}",
        compareUrlFormat: "https://github.com{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}",
        userUrlFormat: "https://github.com{{user}}"
      } satisfies PresetConfig,
      writerOpts: {
          // 2. This helper function is what allows the author to appear
          includeDetails: true,
          transform: (commit, _context) => {
          // If the commit has a known author, append it to the subject
          if (commit.authorName || commit.committerName) {
              const author = commit.authorName || commit.committerName;
              commit.subject = `${commit.subject} by @${author}`;
          }
          return commit;
          }
      } satisfies WriterOptions<Commit>,
      // Path filtering that changelogithub does not support for scoped release notes per package.
      gitRawCommitsOpts: {
        path: [".", "../../tsconfig.json"]
      } satisfies GitRawCommits.GitOptions
    }
  },
  git: {
    requireCleanWorkingDir: false,
    addUntrackedFiles: true,
    tagName: `${name}-v\${version}`,
    commitMessage: `chore(${name}): release v\${version}`,
  },
  github: {
    release: true,
    releaseName: `${name} \${version}`,
  }
});

export default baseConfig;
