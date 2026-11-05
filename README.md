# Daily-logs

Pixel Watch / Pixel のバイタル・睡眠・滞在データを、毎朝 06:30 JST に自動で
`logs/YYYY-MM-DD.md`（YAML Frontmatter 付き Markdown）として保存するリポジトリ。

- 書き込み元: lifelog アプリ（Cloud Run の `/api/cron/daily-digest`）
- 閲覧: Obsidian（obsidian-git、またはクローンしたフォルダを Vault として開く）
- 非公開リポジトリのまま使うこと（健康・位置情報を含むため）

以前ここにあった日記アプリのコードは、このリポジトリの Git 履歴に残っています。
