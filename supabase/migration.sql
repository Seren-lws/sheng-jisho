-- 极简辞书：words 表
-- 在 Supabase SQL Editor 中运行此脚本

-- 创建独立 schema（与同项目其他应用隔离）
create schema if not exists sheng_jisho;

-- 允许 anon / authenticated 角色访问此 schema
grant usage on schema sheng_jisho to anon, authenticated;
alter default privileges in schema sheng_jisho
  grant select, insert, update, delete on tables to anon, authenticated;

create table if not exists sheng_jisho.words (
  id uuid default gen_random_uuid() primary key,
  original text not null unique,
  kana text not null default '',
  pitch text not null default '?',
  pos text not null default '',
  meaning text not null default '',
  tags text[] not null default '{}',

  -- FSRS 调度字段
  srs_due timestamptz default now(),
  srs_stability float8 default 0,
  srs_difficulty float8 default 0,
  srs_elapsed_days int default 0,
  srs_scheduled_days int default 0,
  srs_reps int default 0,
  srs_lapses int default 0,
  srs_state int default 0,
  srs_rank text default '新手' check (srs_rank in ('新手', '熟练', '精通', '已毕业')),

  created_at timestamptz default now()
);

-- 索引
create index if not exists idx_words_srs_due on sheng_jisho.words (srs_due);
create index if not exists idx_words_srs_rank on sheng_jisho.words (srs_rank);
create index if not exists idx_words_tags on sheng_jisho.words using gin (tags);
