-- 极简辞书：words 表
-- 在 Supabase SQL Editor 中运行此脚本

create table if not exists words (
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
create index if not exists idx_words_srs_due on words (srs_due);
create index if not exists idx_words_srs_rank on words (srs_rank);
create index if not exists idx_words_tags on words using gin (tags);
