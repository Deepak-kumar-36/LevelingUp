# Leveling Up

## Product Vision & Philosophy

Version 1.0

---

# 1. Introduction

Leveling Up is not a habit tracker.

It is not a to-do application.

It is not a calendar.

It is not a note-taking application.

It is a Personal Operating System.

The goal of Leveling Up is to centralize every aspect of personal growth into a single platform.

The application acts as a command center where the user tracks:

* Learning
* Skill Development
* Physical Health
* Academic Progress
* Financial Management
* Personal Growth

while providing accountability through progression systems, penalties, rewards, and visible life progress.

---

# 2. Problem Statement

Most productivity systems fail because they focus on isolated activities.

Examples:

* Habit trackers only track habits.
* To-do apps only track tasks.
* Note apps only track notes.
* Finance apps only track expenses.

As a result, users maintain multiple systems simultaneously.

This creates:

* Fragmentation
* Information overload
* Loss of accountability
* Inconsistent execution

The user eventually abandons all systems.

---

# 3. Target User

Primary User:

Deepak Kumar

Profile:

* Computer Science Student
* Competitive Programming Learner
* Full Stack Development Learner
* Hostel Resident
* Budget-Conscious
* Goal-Oriented
* Frequently Overwhelmed By Multiple Objectives

Current Challenges:

* Inconsistency
* Doom Scrolling
* Losing Streaks
* Forgetting Tasks
* Poor Planning
* Goal Overload

---

# 4. Core Mission

Transform life progression into a measurable system.

Every day must answer:

"What progress did I make today?"

Instead of:

"What tasks did I complete today?"

The focus is progress, not activity.

---

# 5. Product Principles

## Principle 1: Progress Over Productivity

Traditional apps reward activity.

Leveling Up rewards meaningful progress.

Example:

Bad:

Study for 2 hours.

Good:

Complete 2 Striver problems.

---

## Principle 2: Nothing Disappears

Most habit trackers remove missed tasks.

Leveling Up never removes missed work.

Missed work becomes debt.

Debt accumulates until resolved.

Example:

Monday:

2 Questions Missed

Tuesday:

2 New Questions

Backlog:

2 Questions

Total Due:

4 Questions

---

## Principle 3: One Source Of Truth

The application should contain:

* Tasks
* Progress
* Notes
* Health
* Finance
* Academic Goals

No external tracking systems required.

---

## Principle 4: Local First

User owns data.

Application must function without internet.

All primary features remain available offline.

Synchronization is optional.

---

## Principle 5: Minimalism

The application should never feel playful.

It should feel professional.

No:

* Cartoon avatars
* Particle effects
* Confetti
* Excessive animations
* Bright colors

The interface must remain calm and information dense.

---

# 6. Why The Name "Leveling Up"

The user is improving independently.

No social validation.

No public leaderboard.

No competition with friends.

The only competition is yesterday's version of the user.

Every completed objective contributes to leveling up.

Every missed objective contributes to stagnation.

The system reflects this journey.

---

# 7. Definition Of Success

The application is successful if:

The user consistently performs:

* DSA Practice
* Development Learning
* Academic Work
* Health Management
* Financial Tracking

for multiple years.

The goal is not daily motivation.

The goal is sustainable execution.

---

# 8. Emotional Experience

The user should feel:

* Clarity
* Control
* Ownership
* Accountability

The user should never feel:

* Overwhelmed
* Distracted
* Pressured by notifications
* Manipulated by dopamine mechanics

---

# 9. Product Categories

Leveling Up combines:

Task Manager
+
Habit Tracker
+
Progress Tracker
+
Life Dashboard
+
Weight Tracker
+
Expense Tracker
+
Knowledge Vault

into a single platform.

---

# 10. Long-Term Vision

Five years from now, Leveling Up should function as a complete personal operating system.

Potential future modules:

* AI Coach
* Internship Tracker
* Resume Tracker
* Job Application Tracker
* Learning Recommendation Engine
* Knowledge Graph
* Linux Desktop Client
* Android Application
* Command Line Interface

while maintaining the same minimalist philosophy.

---

End of Part 1
# Leveling Up

# Part 2 – User Flows & Feature Specifications

Version 1.0

---

# 1. Application Structure

The application contains 8 primary modules.

1. Dashboard
2. Calendar
3. Progress
4. Health
5. Finance
6. Notes
7. Statistics
8. Settings

The Dashboard serves as the central command center.

---

# 2. First-Time User Experience

## Initial Setup

When the application is opened for the first time:

User is greeted with:

WELCOME TO Leveling Up

The system requests:

* Name
* Current Weight
* Target Weight
* Current CGPA
* Target CGPA

---

Example:

Name:
Deepak

Current Weight:
56

Target Weight:
65

Current CGPA:
8.81

Target CGPA:
9.20

---

After setup:

Default quests are automatically generated.

---

# 3. Dashboard

Dashboard is the most important screen.

The user should spend 80% of their time here.

---

## Dashboard Layout

Top Bar

Contains:

Leveling Up

Current Rank

Current XP

Current Streak

Current Coins

---

Example:

Leveling Up

D Rank

XP:
1840 / 3000

Streak:
17 Days

Coins:
420

---

# 4. Today's Quests Section

Shows active daily quests.

Example:

□ Striver Progress

□ Web Development

□ Codeforces Problem

□ Calories Goal

□ Protein Goal

□ Expense Entry

□ Daily Note

---

Completion behavior:

Unchecked → Checked

Rewards:

XP

Coins

Stat Growth

---

# 5. Quest Details

Every quest contains:

Quest Name

Quest Type

Target

Reward

Penalty

Status

---

Example:

Quest:
Codeforces

Type:
Count Based

Target:
1 Problem

Reward:
+30 XP

Penalty:
+10 XP Debt

Status:
Incomplete

---

# 6. Weekly Objectives

Located below Daily Quests.

Example:

LEETCODE

3 / 7 Problems

Contest:
0 / 1

---

CODEFORCES

2 / 5 Problems

Contest:
1 / 1

---

CS50X

0 / 1 Lecture

---

CS50P

0 / 1 Problem Set

---

Weekly objectives reset every Monday.

---

# 7. Backlog System

The most important feature.

Missed work never disappears.

---

Scenario

Monday:

Target:

2 Questions

Completed:

0

---

Tuesday:

Target:

2 Questions

Backlog:

2 Questions

Total Due:

4 Questions

---

Rules:

Backlog stacks indefinitely.

Backlog can never be deleted.

Backlog can only be completed.

---

# 8. Debt System

Debt represents unfinished work.

Formula:

Debt = Missed Work + Penalties

---

Example:

Missed:

2 Questions

Debt:

2 Questions

---

Missed Again:

Debt:

4 Questions

---

Purpose:

Create accountability.

---

# 9. Daily Completion Flow

User opens app.

System displays:

Today's Quests

Backlogs

Weekly Progress

---

User completes task.

Clicks Complete.

System:

Adds XP

Adds Coins

Updates Stats

Updates Streak

Updates Calendar

Updates Progress Tree

---

# 10. Daily Failure Flow

At midnight:

System checks incomplete tasks.

---

Example:

Incomplete:

Codeforces

---

System:

Creates backlog

Applies penalty

Removes completion opportunity

Logs failure

---

Result:

Tomorrow contains additional work.

---

# 11. Calendar View

Calendar inspired by minimalist productivity dashboards.

---

Each day stores:

XP Earned

Coins Earned

Tasks Completed

Tasks Failed

Notes Created

Weight Logged

Expenses Logged

---

Color Intensity

Higher completion = brighter cell

Lower completion = darker cell

---

Clicking a day opens:

Day Details

---

# 12. Day Details Page

Contains:

Date

Tasks Completed

Tasks Failed

XP Earned

Coins Earned

Notes

Expenses

Food Entries

Weight Entries

---

Purpose:

Historical review.

---

# 13. Progress Trees

The application tracks life progression.

---

DSA Tree

Arrays

Recursion

Linked Lists

Trees

Graphs

Dynamic Programming

---

Web Development Tree

HTML

CSS

JavaScript

React

Backend

Databases

Deployment

Projects

---

Academic Tree

Assignments

Practicals

Exams

CGPA

---

Health Tree

Calories

Protein

Weight

---

Finance Tree

Expenses

Savings

---

# 14. Progress Tree Behavior

Every node contains:

Title

Progress

Completion %

XP Reward

Boss Reward

---

Example:

Arrays

18 / 36

50%

Reward:

500 XP

---

Completion unlocks:

Boss Battle

---

# 15. Boss Battle System

Boss Battles represent milestones.

---

Example:

ARRAY MASTER

Requirement:

Complete Arrays

Reward:

1000 XP

100 Coins

Title Unlock

---

Bosses never reset.

---

# 16. Statistics Overview

Statistics screen contains:

Current Rank

Current XP

Total XP

Current Streak

Longest Streak

Completion %

Tasks Completed

Tasks Failed

Total Notes

Total Expenses Logged

Total Weight Entries

---

Purpose:

Show long-term growth.

---

# 17. Search System

Global search.

Search:

Notes

Tasks

Bosses

Progress Trees

Expenses

---

Example:

Search:

Binary Search

Returns:

Notes

Progress Nodes

Completed Tasks

Related Entries

---

# 18. Offline Behavior

All features work without internet.

No dependency on cloud services.

No login required.

No account required.

All data stored locally.

---

# 19. Sync Behavior

Future Feature.

Manual Sync.

User controls synchronization.

No automatic cloud lock-in.

---

# 20. Core User Loop

Wake Up

↓

Open Leveling Up

↓

See Today's Quests

↓

Complete Work

↓

Gain XP

↓

Improve Stats

↓

Progress Trees Advance

↓

Bosses Defeated

↓

Rank Up

↓

Repeat

---

End of Part 2
# Leveling Up

# Part 3 – RPG Economy & Progression System

Version 1.0

---

# 1. Purpose

The RPG system exists to create accountability.

The objective is NOT entertainment.

The objective is to make progress visible.

Every action performed by the user contributes toward growth.

Every missed action creates consequences.

---

# 2. Core Progression Loop

Complete Quest

↓

Gain XP

↓

Gain Coins

↓

Increase Stats

↓

Increase Rank Progress

↓

Unlock Bosses

↓

Defeat Bosses

↓

Reach Higher Ranks

↓

Repeat

---

# 3. XP System

XP represents growth.

XP cannot be purchased.

XP can only be earned through actions.

---

# 4. Daily XP Rewards

## Striver Progress

Complete Daily Goal

Reward:

50 XP

---

## Web Development

Complete Daily Goal

Reward:

50 XP

---

## Codeforces Problem

Complete Daily Goal

Reward:

30 XP

---

## Calories Goal

Hit Daily Calories

Reward:

20 XP

---

## Protein Goal

Hit Protein Goal

Reward:

20 XP

---

## Expense Tracking

Reward:

10 XP

---

## Daily Notes

Reward:

10 XP

---

Maximum Daily XP

Approx:

190 XP

---

# 5. Weekly XP Rewards

LeetCode

7 Questions Completed

Reward:

200 XP

---

LeetCode Contest

Reward:

300 XP

---

Codeforces

5 Questions Completed

Reward:

200 XP

---

Codeforces Contest

Reward:

300 XP

---

CS50x

Reward:

300 XP

---

CS50P

Reward:

300 XP

---

# 6. Boss Rewards

Bosses grant significant XP.

Example:

Arrays Complete

Reward:

1000 XP

---

React Complete

Reward:

1200 XP

---

65 KG Achieved

Reward:

2000 XP

---

CGPA 9.2+

Reward:

3000 XP

---

# 7. Coin System

Coins are the premium in-game currency.

Purpose:

Self-reward system.

---

# 8. Coin Earnings

Striver

10 Coins

---

Web Dev

10 Coins

---

Codeforces

5 Coins

---

Calories Goal

5 Coins

---

Protein Goal

5 Coins

---

Expense Tracking

2 Coins

---

Daily Note

2 Coins

---

Maximum Daily Coins

Approximately:

39 Coins

---

# 9. Reward Shop

Coins can only be spent here.

---

Chocolate

150 Coins

---

Special Coffee

200 Coins

---

Movie Night

500 Coins

---

Restaurant Meal

700 Coins

---

Cheat Meal

1000 Coins

---

Skip Pass

1200 Coins

---

Custom Rewards

User Defined

---

# 10. Skip Pass

Purpose:

Protect streak.

---

Rules

Can only be used before day ends.

Cannot complete tasks automatically.

Only preserves streak.

---

Limit

Maximum:

2 Per Month

---

# 11. Streak System

Tracks consecutive days.

---

A day counts if:

Minimum Completion:

70%

---

Example

7 Tasks

Need:

5 Completed

---

Otherwise:

Streak Broken

---

# 12. Streak Milestones

7 Days

Reward:

100 XP

---

14 Days

Reward:

250 XP

---

30 Days

Reward:

500 XP

---

60 Days

Reward:

1000 XP

---

100 Days

Reward:

Exclusive Title

---

365 Days

Reward:

Monarch Achievement

---

# 13. Stat System

Stats represent growth areas.

---

INTELLIGENCE

Measures:

Problem Solving

Learning

Technical Growth

---

Increased By

Striver

LeetCode

Codeforces

CS50

---

BUILDER

Measures:

Creation

Projects

Development

---

Increased By

Web Development

Projects

Hackathons

---

DISCIPLINE

Measures:

Consistency

Execution

Reliability

---

Increased By

Daily Completion

Streaks

---

Decreased By

Missed Tasks

Backlogs

---

VITALITY

Measures:

Health

Energy

Nutrition

---

Increased By

Calories

Protein

Weight Gain

---

WEALTH

Measures:

Financial Awareness

Budget Control

Tracking Consistency

---

Increased By

Expense Logging

Savings

---

# 14. Stat Growth Formula

Every completed activity contributes.

Example:

Striver Completed

+2 Intelligence

+1 Discipline

---

Web Dev

+2 Builder

+1 Discipline

---

Calories Goal

+2 Vitality

---

Expense Tracking

+1 Wealth

---

# 15. Penalty System

Missing work has consequences.

---

Level 1 Penalty

Task Missed Once

Result:

Lose Coins

Create Backlog

---

Level 2 Penalty

Task Missed Two Days

Result:

Double Backlog

XP Reduction

---

Level 3 Penalty

Task Missed Three Days

Result:

Punishment Quest

---

# 16. Punishment Quests

Real-world penalties.

Examples:

Read 10 Pages

Walk 20 Minutes

No Reels For 1 Hour

No Shorts For 1 Hour

Clean Room

Drink Extra Water

---

Purpose:

Convert failure into productive action.

---

# 17. Doom Scroll System

Optional Module.

---

User Logs:

Instagram Time

Reels Time

Shorts Time

---

If Limit Exceeded:

Penalty

* Coins

- Punishment Quest

---

Example

Reels

45 Minutes

Limit

30 Minutes

Result

-20 Coins

Read 10 Pages

---

# 18. Backlog System

Most important mechanic.

---

Tasks never disappear.

---

Example

Monday

Missed:

2 Questions

---

Tuesday

New:

2 Questions

Backlog:

2 Questions

Total:

4 Questions

---

Backlogs can stack infinitely.

---

# 19. Titles

Titles are cosmetic.

---

Examples

Novice Hunter

Problem Solver

Array Master

Code Warrior

Builder

Disciplined Hunter

Scholar

Consistency King

Monarch Candidate

Shadow Monarch

---

# 20. Endgame

The application has no true ending.

The final goal is not:

Reach Level 100

The final goal is:

Become the person capable of:

* Solving DSA problems consistently
* Building projects
* Maintaining health
* Managing finances
* Excelling academically

The game is a reflection of real-life growth.

---

End of Part 3
# Leveling Up

# Part 4 – Database Design & System Architecture

Version 1.0

---

# 1. Purpose

This document defines:

* Data Models
* Database Structure
* Relationships
* Storage Design
* Sync Strategy

The architecture follows:

Local First

Offline First

Optional Cloud Sync

The database should work identically on:

* Web
* Android
* Linux Desktop

---

# 2. Database Philosophy

Every important action must be stored.

The system should allow:

* Historical tracking
* Analytics
* Progress visualization
* Future AI insights

No information should be lost.

---

# 3. Storage Layer

Version 1

Frontend:

React

Storage:

IndexedDB

Library:

Dexie.js

---

Future

Desktop:

SQLite

---

Future Sync

Supabase

---

# 4. Database Overview

Main Entities

User

Quests

Quest Logs

Stats

XP

Coins

Ranks

Backlogs

Calendar

Notes

Expenses

Food Logs

Weight Logs

Progress Trees

Boss Battles

Achievements

Settings

---

# 5. User Table

Stores account information.

```sql
users
```

Fields

```text
id

name

current_weight

target_weight

current_cgpa

target_cgpa

created_at

updated_at
```

Example

```json
{
  "id": "user_001",
  "name": "Deepak",
  "current_weight": 56,
  "target_weight": 65,
  "current_cgpa": 8.81,
  "target_cgpa": 9.20
}
```

---

# 6. Rank Table

Tracks progression.

```sql
ranks
```

Fields

```text
id

current_rank

total_xp

current_level

updated_at
```

Example

```json
{
  "current_rank": "D Rank",
  "total_xp": 1840
}
```

---

# 7. Stats Table

Tracks growth areas.

```sql
stats
```

Fields

```text
id

intelligence

builder

discipline

vitality

wealth

updated_at
```

Example

```json
{
  "intelligence": 74,
  "builder": 43,
  "discipline": 61,
  "vitality": 30,
  "wealth": 18
}
```

---

# 8. Daily Quest Table

Stores active quests.

```sql
daily_quests
```

Fields

```text
id

name

type

target

xp_reward

coin_reward

is_active

created_at
```

Example

```json
{
  "name": "Codeforces Problem",
  "target": 1,
  "xp_reward": 30,
  "coin_reward": 5
}
```

---

# 9. Quest Log Table

Tracks daily completion.

```sql
quest_logs
```

Fields

```text
id

quest_id

date

status

completion_value

xp_earned

coins_earned
```

Status

```text
completed

missed

partial
```

---

# 10. Weekly Goals Table

Stores recurring weekly goals.

```sql
weekly_goals
```

Fields

```text
id

name

target

current_progress

week_start

week_end

completed
```

Examples

```text
LeetCode

Codeforces

CS50x

CS50P
```

---

# 11. Backlog Table

Most important table.

```sql
backlogs
```

Fields

```text
id

source_task

pending_amount

created_at

status
```

Status

```text
active

completed
```

Example

```json
{
  "source_task": "LeetCode",
  "pending_amount": 3
}
```

---

# 12. XP History Table

Tracks every XP transaction.

```sql
xp_logs
```

Fields

```text
id

source

amount

date

reason
```

Example

```json
{
  "source": "Striver",
  "amount": 50
}
```

---

# 13. Coin History Table

Tracks every coin transaction.

```sql
coin_logs
```

Fields

```text
id

amount

type

source

date
```

Types

```text
earned

spent

penalty
```

---

# 14. Reward Shop Table

Stores available rewards.

```sql
shop_rewards
```

Fields

```text
id

name

cost

description

active
```

Examples

```text
Chocolate

Movie

Skip Pass

Cheat Meal
```

---

# 15. Notes Table

Simple notes system.

```sql
notes
```

Fields

```text
id

title

content

tags

created_at

updated_at
```

Example

```json
{
  "title": "Hackathon Idea",
  "tags": ["idea"]
}
```

---

# 16. Expense Table

Stores spending.

```sql
expenses
```

Fields

```text
id

amount

category

description

date
```

Categories

```text
food

travel

college

entertainment

misc
```

---

# 17. Weight Log Table

Tracks weight history.

```sql
weight_logs
```

Fields

```text
id

weight

date
```

Example

```json
{
  "weight": 56
}
```

---

# 18. Food Log Table

Stores consumed foods.

```sql
food_logs
```

Fields

```text
id

food_name

quantity

calories

protein

date
```

Example

```json
{
  "food_name": "Egg",
  "quantity": 4,
  "calories": 280,
  "protein": 24
}
```

---

# 19. Nutrition Summary Table

Daily nutrition totals.

```sql
nutrition_summary
```

Fields

```text
id

date

total_calories

target_calories

total_protein

target_protein
```

---

# 20. Progress Tree Table

Tracks long-term goals.

```sql
progress_nodes
```

Fields

```text
id

category

name

progress

target

completed
```

Example

```json
{
  "category": "DSA",
  "name": "Arrays",
  "progress": 17,
  "target": 36
}
```

---

# 21. Boss Battle Table

Stores milestone goals.

```sql
boss_battles
```

Fields

```text
id

title

category

reward_xp

reward_coins

completed

completed_at
```

Examples

```text
Array Master

React Warrior

65 KG Achieved
```

---

# 22. Achievement Table

Permanent achievements.

```sql
achievements
```

Fields

```text
id

title

description

earned_at
```

Examples

```text
30 Day Streak

100 Problems Solved

First Contest
```

---

# 23. Calendar Table

Stores day summaries.

```sql
calendar_entries
```

Fields

```text
id

date

xp_earned

coins_earned

tasks_completed

tasks_failed
```

Purpose

Fast dashboard rendering.

---

# 24. Settings Table

User preferences.

```sql
settings
```

Fields

```text
id

theme

notifications

sync_enabled

doom_scroll_tracking
```

---

# 25. Relationships

User

↓

Stats

↓

XP

↓

Rank

↓

Achievements

---

Daily Quests

↓

Quest Logs

↓

Backlogs

---

Food Logs

↓

Nutrition Summary

↓

Vitality Stat

---

Expenses

↓

Wealth Stat

---

Progress Nodes

↓

Boss Battles

↓

Achievements

---

# 26. Sync Strategy

Version 1

Local only.

---

Version 2

Manual Export

JSON Backup

Import Restore

---

Version 3

Supabase Sync

Conflict Resolution

Last Write Wins

---

# 27. Performance Goals

Dashboard Load

< 500ms

---

Search

< 200ms

---

Offline Availability

100%

---

Data Loss

0%

---

# 28. Future AI Integration Tables

Reserved

ai_reviews

ai_recommendations

habit_templates

goal_predictions

These will remain unused until Phase 3.

---

End of Part 4
# Leveling Up

# Part 5 – UI/UX Design Specification

Version 1.0

---

# 1. Design Philosophy

Leveling Up is NOT a gaming app.

Leveling Up is NOT a social media app.

Leveling Up is NOT a motivational app.

Leveling Up is a Personal Operating System.

The UI should feel like:

* Obsidian
* GitHub
* Linear
* Raycast
* Minimal Analytics Dashboards

NOT like:

* Habitica
* Duolingo
* Forest
* Mobile Games

---

# 2. Core Design Principles

## Principle 1

Information First

Every screen must answer:

"What should I do next?"

within 3 seconds.

---

## Principle 2

Minimal Visual Noise

Avoid:

* Gradients
* Glassmorphism
* Animations
* Shadows
* Bright colors
* Decorative illustrations

---

## Principle 3

Dark First

The application is designed for:

* Late night study
* Hostel rooms
* Long coding sessions

Dark mode is the default.

---

## Principle 4

Dashboard Driven

User should not need to navigate frequently.

Most information should be visible from the Dashboard.

---

# 3. Color System

## Background

Primary

```css
#0A0A0A
```

---

Secondary

```css
#111111
```

---

Card Background

```css
#151515
```

---

Border

```css
#262626
```

---

# Text Colors

Primary

```css
#FFFFFF
```

---

Secondary

```css
#A3A3A3
```

---

Muted

```css
#737373
```

---

# Accent Colors

Success

```css
#22C55E
```

---

Warning

```css
#EAB308
```

---

Danger

```css
#EF4444
```

---

Info

```css
#3B82F6
```

---

# 4. Typography

Primary Font

JetBrains Mono

Fallback

IBM Plex Mono

Final Fallback

monospace

---

Headings

Weight

700

---

Body

Weight

400

---

Small Labels

Weight

500

---

# 5. Layout System

Desktop Layout

Three Column Design

---

Left Sidebar

280px

---

Main Content

Flexible

---

Right Sidebar

320px

---

Structure

```text
┌────────┬────────────────────┬─────────┐
│ Sidebar│     Content        │ Summary │
└────────┴────────────────────┴─────────┘
```

---

# 6. Navigation

Sidebar Items

Dashboard

Calendar

Progress

Health

Finance

Notes

Statistics

Settings

---

Active item:

Left border indicator

Subtle highlight

No animation

---

# 7. Dashboard

Most important screen.

---

Top Section

Contains:

Rank

XP

Coins

Streak

Current Title

---

Example

```text
D Rank

XP
1840 / 3000

Coins
420

Streak
18 Days

Title
Problem Solver
```

---

# 8. Dashboard Cards

Every card uses:

Border

Rounded Corners

No Shadow

---

Radius

12px

---

Padding

16px

---

# 9. Today's Quests Panel

Left section.

Shows:

Daily Quests

Weekly Goals

Backlogs

---

Example

```text
TODAY

□ Striver

□ Web Dev

□ Calories

□ Protein

□ Notes

□ Expense

□ Codeforces
```

---

# 10. Quest Interaction

Unchecked

↓

Checked

↓

Animation:

NONE

---

Reward Toast

Small notification

Example

```text
+50 XP

+10 Coins
```

Duration

2 Seconds

---

# 11. Calendar Page

Inspired directly by the provided reference.

---

Monthly View

Heatmap Style

---

Each day displays:

Completion %

XP Earned

---

Color Scale

0%

Dark Gray

25%

Light Gray

50%

Blue

75%

Green

100%

Bright Green

---

Click Day

↓

Open Day Detail Modal

---

# 12. Day Detail Screen

Displays:

Date

Completed Quests

Failed Quests

Notes

Expenses

Food Logs

XP Earned

Coins Earned

---

Purpose

Review performance.

---

# 13. Progress Screen

Shows all life progression.

---

Categories

DSA

Development

Academics

Health

Finance

---

Each category contains:

Progress Bar

Completion %

Current Milestone

Next Milestone

---

Example

```text
Arrays

17 / 36

47%
```

---

# 14. Boss Battle Screen

Lists major milestones.

---

Status

Locked

Active

Completed

---

Example

```text
ARRAY MASTER

17 / 36

Reward

1000 XP
```

---

# 15. Health Screen

Contains:

Weight

Calories

Protein

History

---

Top Card

```text
Current Weight

56 KG

Goal

65 KG
```

---

Progress Visualization

Simple Line Graph

No fancy charts.

---

# 16. Food Entry UX

Input Box

User Types

```text
4 eggs
500ml milk
2 bananas
```

---

Food Parser

Calculates

Calories

Protein

---

Displays

```text
Calories

820

Protein

42g
```

---

# 17. Finance Screen

Top Section

Today's Spending

---

Middle

Category Breakdown

---

Bottom

Monthly Trend

---

Categories

Food

Travel

College

Entertainment

Misc

---

# 18. Notes Screen

Very minimal.

---

Top

Search Notes

---

Middle

Notes List

---

Right

Editor

---

Fields

Title

Tags

Content

---

No folders.

No markdown required.

No backlinks.

---

# 19. Statistics Screen

Contains

Lifetime Data

---

Metrics

Total XP

Current Rank

Longest Streak

Completion Rate

Tasks Completed

Tasks Failed

Notes Created

Weight Entries

Expense Entries

---

# 20. Search Experience

Global Search

Keyboard Shortcut

Ctrl + K

---

Searches

Notes

Tasks

Bosses

Progress

Food Logs

Expenses

---

Results appear instantly.

---

# 21. Mobile Layout

Single Column

Bottom Navigation

---

Navigation

Dashboard

Progress

Health

Notes

More

---

Dashboard cards stack vertically.

---

# 22. Accessibility

Minimum Contrast

WCAG AA

---

Keyboard Navigation

Full Support

---

Tab Navigation

Required

---

# 23. Empty States

Never display blank screens.

---

Example

Notes Empty

```text
No notes yet.

Capture your first idea.
```

---

Health Empty

```text
No weight logs.

Add your current weight.
```

---

# 24. Loading States

Skeleton UI

No spinners.

---

Purpose

Keep interface professional.

---

# 25. Future Desktop Version

Design must scale to:

Linux Desktop

Tauri

---

Desktop should feel like:

* VS Code
* Obsidian
* Linear

---

# 26. Future Android Version

PWA First

Installable

Offline

Fast Startup

Minimal Battery Usage

---

# 27. Final UX Goal

When the user opens Leveling Up:

Within 5 seconds they should know:

* What needs to be done
* What was missed
* What progress was made
* What goal is closest to completion

without opening any other screen.

---

End of Part 5
# Leveling Up

# Part 6 – Feature Logic & Business Rules

Version 1.0

---

# 1. Purpose

This document defines:

* Application Rules
* XP Calculations
* Rank Progression
* Streak Logic
* Backlog Logic
* Quest Completion Rules
* Coin Economy
* Health Calculations
* Calendar Calculations

This document is the source of truth for all application behavior.

---

# 2. Daily Reset System

A new day begins at:

```text
00:00 Local Time
```

---

At reset:

System performs:

1. Check incomplete quests
2. Create backlogs
3. Apply penalties
4. Generate today's quests
5. Update streak status
6. Generate calendar entry

---

# 3. Quest Types

The application supports 4 quest types.

---

## Binary Quest

Completed or not completed.

Examples:

```text
Expense Log

Daily Note

Web Development Session
```

---

Completion Values:

```text
true

false
```

---

## Count Quest

Target number required.

Examples:

```text
LeetCode Problems

Codeforces Problems

Meals
```

---

Example:

```text
Target: 5

Completed: 3

Progress: 60%
```

---

## Time Quest

Tracks duration.

Examples:

```text
Study Session

Web Development

Reading
```

---

Example:

```text
Target: 60 min

Completed: 45 min

Progress: 75%
```

---

## Progress Quest

Tracks long-term goals.

Examples:

```text
Arrays

Recursion

React

Backend
```

---

# 4. Daily Quest Completion Rules

Quest becomes COMPLETE when:

```text
Progress >= Target
```

---

Examples

Target:

```text
2 Questions
```

Completed:

```text
2 Questions
```

Status:

```text
COMPLETE
```

---

Target:

```text
5 Problems
```

Completed:

```text
3 Problems
```

Status:

```text
PARTIAL
```

---

# 5. XP System

XP is the primary progression metric.

---

# 6. XP Formula

Every quest contains:

```text
base_xp
```

---

Formula:

```text
earned_xp
=
base_xp × completion_percentage
```

---

Example

Base XP:

```text
50
```

Progress:

```text
60%
```

Earned XP:

```text
30 XP
```

---

# 7. XP Rewards

Daily Quests

---

Striver

```text
50 XP
```

---

Web Development

```text
50 XP
```

---

Codeforces

```text
30 XP
```

---

Calories Goal

```text
20 XP
```

---

Protein Goal

```text
20 XP
```

---

Expense Entry

```text
10 XP
```

---

Daily Note

```text
10 XP
```

---

# 8. Weekly XP Rewards

LeetCode Weekly Goal

```text
200 XP
```

---

LeetCode Contest

```text
300 XP
```

---

Codeforces Weekly Goal

```text
200 XP
```

---

Codeforces Contest

```text
300 XP
```

---

CS50x

```text
300 XP
```

---

CS50P

```text
300 XP
```

---

# 9. Boss XP Rewards

Bosses grant large rewards.

---

Arrays

```text
1000 XP
```

---

Recursion

```text
1000 XP
```

---

React

```text
1200 XP
```

---

65 KG Goal

```text
2000 XP
```

---

CGPA 9.2

```text
3000 XP
```

---

# 10. Coin Formula

Coins are secondary rewards.

---

Formula

```text
coins
=
base_coins × completion_percentage
```

---

Example

Target:

5 Problems

Completed:

3 Problems

Coins:

60%

````

---

# 11. Coin Rewards

Striver

```text
10 Coins
````

---

Web Dev

```text
10 Coins
```

---

Codeforces

```text
5 Coins
```

---

Calories Goal

```text
5 Coins
```

---

Protein Goal

```text
5 Coins
```

---

Expense Log

```text
2 Coins
```

---

Daily Note

```text
2 Coins
```

---

# 12. Rank System

Ranks depend on TOTAL XP.

---

E Rank

```text
0-999
```

---

D Rank

```text
1000-2999
```

---

C Rank

```text
3000-6999
```

---

B Rank

```text
7000-14999
```

---

A Rank

```text
15000-29999
```

---

S Rank

```text
30000-59999
```

---

National Rank Hunter

```text
60000-99999
```

---

Monarch Candidate

```text
100000+
```

---

Shadow Monarch

```text
Special Endgame
```

---

# 13. Rank Promotion

When XP exceeds threshold:

System automatically:

1. Promotes rank
2. Generates rank achievement
3. Grants bonus coins

---

Promotion Reward

```text
500 Coins
```

---

# 14. Streak System

Tracks consistency.

---

Day counts only if:

```text
Completion >= 70%
```

---

Example

7 Daily Quests

Need:

```text
5 Completed
```

---

Result:

Streak Continues

---

# 15. Streak Break Logic

Completion:

```text
< 70%
```

Result:

```text
Streak Broken
```

---

# 16. Skip Pass Logic

Skip Pass protects streak.

---

Requirements

User owns Skip Pass

---

Effect

Streak remains active

---

Tasks remain incomplete

Backlogs still generated

---

# 17. Streak Rewards

7 Days

```text
100 XP
```

---

14 Days

```text
250 XP
```

---

30 Days

```text
500 XP
```

---

60 Days

```text
1000 XP
```

---

100 Days

Achievement

---

365 Days

Monarch Achievement

---

# 18. Backlog Creation Logic

At reset:

Incomplete tasks become backlog.

---

Example

Daily Goal:

```text
2 Problems
```

Completed:

```text
0
```

---

Backlog Created:

```text
2 Problems
```

---

# 19. Backlog Stacking Logic

Existing Backlog:

```text
3 Problems
```

---

Missed Today:

```text
2 Problems
```

---

New Backlog:

```text
5 Problems
```

---

# 20. Backlog Completion Logic

Backlog always consumes progress first.

---

Example

Backlog:

```text
3 Problems
```

---

Today Goal:

```text
2 Problems
```

---

Completed:

```text
4 Problems
```

---

Result

Backlog:

```text
0
```

Today's Goal:

```text
1 Remaining
```

---

# 21. Penalty System

Missing tasks creates penalties.

---

Level 1

Miss Once

```text
-20 Coins
```

---

Level 2

Miss Twice

```text
-50 Coins
```

---

Level 3

Miss Three Times

```text
Punishment Quest
```

---

# 22. Punishment Quest Logic

Examples

Read 10 Pages

Walk 20 Minutes

No Shorts 1 Hour

Clean Desk

Drink 1L Water

---

Completion removes penalty status.

---

# 23. Health Logic

Daily Calories Goal

```text
3000 kcal
```

---

Daily Protein Goal

```text
120 g
```

---

Calories Quest Complete

If:

```text
consumed >= target
```

---

Protein Quest Complete

If:

```text
protein >= target
```

---

# 24. Weight Tracking Logic

User logs weight.

---

System stores:

Date

Weight

Difference

Trend

---

Weekly average calculated.

---

# 25. Expense Logic

Expense Entry Complete if:

At least 1 expense logged.

---

Categories

Food

Travel

College

Entertainment

Misc

---

# 26. Note Logic

Daily Note complete if:

At least one note created.

---

Minimum Content:

10 Characters

---

# 27. Calendar Aggregation Logic

Every day generates:

```text
completion_percentage

xp_earned

coins_earned

tasks_completed

tasks_failed
```

---

Stored permanently.

---

# 28. Progress Tree Logic

Example

Arrays

Target:

```text
36 Questions
```

Completed:

```text
18
```

---

Progress:

```text
50%
```

---

Completion unlocks Boss.

---

# 29. Boss Unlock Logic

Requirements:

Progress Node Complete

---

Example

Arrays

```text
36/36
```

Boss Unlocked

---

Claim Reward

---

Boss Completed

---

# 30. Achievement Logic

Achievements never expire.

---

Examples

First Note

First Contest

7 Day Streak

100 Problems Solved

65 KG Achieved

CGPA 9.2

---

# 31. Future AI Logic

AI Features will:

Analyze:

* Completion trends
* Backlogs
* Health trends
* Spending patterns

---

AI will never:

Auto-complete quests

Modify progress

Grant XP

Grant Coins

---

# 32. Final Rule

The system never lies.

Missed work remains visible.

Backlogs remain visible.

Progress reflects reality.

No fake productivity.

No artificial motivation.

Only measurable growth.

---

End of Part 6
# Leveling Up

# Part 6 – Feature Logic & Business Rules

Version 1.0

---

# 1. Purpose

This document defines:

* Application Rules
* XP Calculations
* Rank Progression
* Streak Logic
* Backlog Logic
* Quest Completion Rules
* Coin Economy
* Health Calculations
* Calendar Calculations

This document is the source of truth for all application behavior.

---

# 2. Daily Reset System

A new day begins at:

```text
00:00 Local Time
```

---

At reset:

System performs:

1. Check incomplete quests
2. Create backlogs
3. Apply penalties
4. Generate today's quests
5. Update streak status
6. Generate calendar entry

---

# 3. Quest Types

The application supports 4 quest types.

---

## Binary Quest

Completed or not completed.

Examples:

```text
Expense Log

Daily Note

Web Development Session
```

---

Completion Values:

```text
true

false
```

---

## Count Quest

Target number required.

Examples:

```text
LeetCode Problems

Codeforces Problems

Meals
```

---

Example:

```text
Target: 5

Completed: 3

Progress: 60%
```

---

## Time Quest

Tracks duration.

Examples:

```text
Study Session

Web Development

Reading
```

---

Example:

```text
Target: 60 min

Completed: 45 min

Progress: 75%
```

---

## Progress Quest

Tracks long-term goals.

Examples:

```text
Arrays

Recursion

React

Backend
```

---

# 4. Daily Quest Completion Rules

Quest becomes COMPLETE when:

```text
Progress >= Target
```

---

Examples

Target:

```text
2 Questions
```

Completed:

```text
2 Questions
```

Status:

```text
COMPLETE
```

---

Target:

```text
5 Problems
```

Completed:

```text
3 Problems
```

Status:

```text
PARTIAL
```

---

# 5. XP System

XP is the primary progression metric.

---

# 6. XP Formula

Every quest contains:

```text
base_xp
```

---

Formula:

```text
earned_xp
=
base_xp × completion_percentage
```

---

Example

Base XP:

```text
50
```

Progress:

```text
60%
```

Earned XP:

```text
30 XP
```

---

# 7. XP Rewards

Daily Quests

---

Striver

```text
50 XP
```

---

Web Development

```text
50 XP
```

---

Codeforces

```text
30 XP
```

---

Calories Goal

```text
20 XP
```

---

Protein Goal

```text
20 XP
```

---

Expense Entry

```text
10 XP
```

---

Daily Note

```text
10 XP
```

---

# 8. Weekly XP Rewards

LeetCode Weekly Goal

```text
200 XP
```

---

LeetCode Contest

```text
300 XP
```

---

Codeforces Weekly Goal

```text
200 XP
```

---

Codeforces Contest

```text
300 XP
```

---

CS50x

```text
300 XP
```

---

CS50P

```text
300 XP
```

---

# 9. Boss XP Rewards

Bosses grant large rewards.

---

Arrays

```text
1000 XP
```

---

Recursion

```text
1000 XP
```

---

React

```text
1200 XP
```

---

65 KG Goal

```text
2000 XP
```

---

CGPA 9.2

```text
3000 XP
```

---

# 10. Coin Formula

Coins are secondary rewards.

---

Formula

```text
coins
=
base_coins × completion_percentage
```

---

Example

Target:

5 Problems

Completed:

3 Problems

Coins:

60%

````

---

# 11. Coin Rewards

Striver

```text
10 Coins
````

---

Web Dev

```text
10 Coins
```

---

Codeforces

```text
5 Coins
```

---

Calories Goal

```text
5 Coins
```

---

Protein Goal

```text
5 Coins
```

---

Expense Log

```text
2 Coins
```

---

Daily Note

```text
2 Coins
```

---

# 12. Rank System

Ranks depend on TOTAL XP.

---

E Rank

```text
0-999
```

---

D Rank

```text
1000-2999
```

---

C Rank

```text
3000-6999
```

---

B Rank

```text
7000-14999
```

---

A Rank

```text
15000-29999
```

---

S Rank

```text
30000-59999
```

---

National Rank Hunter

```text
60000-99999
```

---

Monarch Candidate

```text
100000+
```

---

Shadow Monarch

```text
Special Endgame
```

---

# 13. Rank Promotion

When XP exceeds threshold:

System automatically:

1. Promotes rank
2. Generates rank achievement
3. Grants bonus coins

---

Promotion Reward

```text
500 Coins
```

---

# 14. Streak System

Tracks consistency.

---

Day counts only if:

```text
Completion >= 70%
```

---

Example

7 Daily Quests

Need:

```text
5 Completed
```

---

Result:

Streak Continues

---

# 15. Streak Break Logic

Completion:

```text
< 70%
```

Result:

```text
Streak Broken
```

---

# 16. Skip Pass Logic

Skip Pass protects streak.

---

Requirements

User owns Skip Pass

---

Effect

Streak remains active

---

Tasks remain incomplete

Backlogs still generated

---

# 17. Streak Rewards

7 Days

```text
100 XP
```

---

14 Days

```text
250 XP
```

---

30 Days

```text
500 XP
```

---

60 Days

```text
1000 XP
```

---

100 Days

Achievement

---

365 Days

Monarch Achievement

---

# 18. Backlog Creation Logic

At reset:

Incomplete tasks become backlog.

---

Example

Daily Goal:

```text
2 Problems
```

Completed:

```text
0
```

---

Backlog Created:

```text
2 Problems
```

---

# 19. Backlog Stacking Logic

Existing Backlog:

```text
3 Problems
```

---

Missed Today:

```text
2 Problems
```

---

New Backlog:

```text
5 Problems
```

---

# 20. Backlog Completion Logic

Backlog always consumes progress first.

---

Example

Backlog:

```text
3 Problems
```

---

Today Goal:

```text
2 Problems
```

---

Completed:

```text
4 Problems
```

---

Result

Backlog:

```text
0
```

Today's Goal:

```text
1 Remaining
```

---

# 21. Penalty System

Missing tasks creates penalties.

---

Level 1

Miss Once

```text
-20 Coins
```

---

Level 2

Miss Twice

```text
-50 Coins
```

---

Level 3

Miss Three Times

```text
Punishment Quest
```

---

# 22. Punishment Quest Logic

Examples

Read 10 Pages

Walk 20 Minutes

No Shorts 1 Hour

Clean Desk

Drink 1L Water

---

Completion removes penalty status.

---

# 23. Health Logic

Daily Calories Goal

```text
3000 kcal
```

---

Daily Protein Goal

```text
120 g
```

---

Calories Quest Complete

If:

```text
consumed >= target
```

---

Protein Quest Complete

If:

```text
protein >= target
```

---

# 24. Weight Tracking Logic

User logs weight.

---

System stores:

Date

Weight

Difference

Trend

---

Weekly average calculated.

---

# 25. Expense Logic

Expense Entry Complete if:

At least 1 expense logged.

---

Categories

Food

Travel

College

Entertainment

Misc

---

# 26. Note Logic

Daily Note complete if:

At least one note created.

---

Minimum Content:

10 Characters

---

# 27. Calendar Aggregation Logic

Every day generates:

```text
completion_percentage

xp_earned

coins_earned

tasks_completed

tasks_failed
```

---

Stored permanently.

---

# 28. Progress Tree Logic

Example

Arrays

Target:

```text
36 Questions
```

Completed:

```text
18
```

---

Progress:

```text
50%
```

---

Completion unlocks Boss.

---

# 29. Boss Unlock Logic

Requirements:

Progress Node Complete

---

Example

Arrays

```text
36/36
```

Boss Unlocked

---

Claim Reward

---

Boss Completed

---

# 30. Achievement Logic

Achievements never expire.

---

Examples

First Note

First Contest

7 Day Streak

100 Problems Solved

65 KG Achieved

CGPA 9.2

---

# 31. Future AI Logic

AI Features will:

Analyze:

* Completion trends
* Backlogs
* Health trends
* Spending patterns

---

AI will never:

Auto-complete quests

Modify progress

Grant XP

Grant Coins

---

# 32. Final Rule

The system never lies.

Missed work remains visible.

Backlogs remain visible.

Progress reflects reality.

No fake productivity.

No artificial motivation.

Only measurable growth.

---

End of Part 6
# Leveling Up

# Part 8 – Development Architecture & Folder Structure

Version 1.0

---

# 1. Purpose

This document defines:

* Project Architecture
* Folder Structure
* State Management
* Database Layer
* Business Logic Layer
* UI Layer
* Future Expansion Strategy

This architecture must support:

* Offline First
* Local First
* PWA
* Android Future
* Linux Desktop Future

without major rewrites.

---

# 2. Technology Stack

## Frontend

```text
React 19
TypeScript
Vite
```

Reason:

Fast development

Excellent ecosystem

Future scalability

---

## Styling

```text
Tailwind CSS
shadcn/ui
```

Reason:

Minimal design

Reusable components

Dark mode support

---

## State Management

```text
Zustand
```

Reason:

Simple

Fast

Minimal boilerplate

---

## Database

```text
Dexie.js
IndexedDB
```

Reason:

Offline first

Large storage

Fast queries

---

## Charts

```text
Recharts
```

Reason:

Lightweight

Simple

Minimal styling

---

## Forms

```text
React Hook Form
Zod
```

Reason:

Validation

Type safety

---

## Date Handling

```text
date-fns
```

---

## Icons

```text
Lucide React
```

---

# 3. Application Layers

The application consists of 5 layers.

```text
UI Layer

↓

Feature Layer

↓

Service Layer

↓

Database Layer

↓

Storage Layer
```

---

# 4. High-Level Architecture

```text
User

↓

Components

↓

Hooks

↓

Services

↓

Database

↓

IndexedDB
```

---

# 5. Folder Structure

```text
src/

├── app/

├── components/

├── features/

├── database/

├── services/

├── hooks/

├── store/

├── types/

├── utils/

├── constants/

├── layouts/

├── pages/

└── assets/
```

---

# 6. App Folder

Contains:

```text
Routing

Providers

Theme Setup

App Initialization
```

Structure

```text
app/

App.tsx

router.tsx

providers.tsx
```

---

# 7. Components Folder

Reusable UI.

```text
components/

ui/

cards/

forms/

charts/

calendar/

modals/
```

Examples

```text
Card.tsx

QuestCard.tsx

ProgressCard.tsx

StatCard.tsx
```

---

# 8. Features Folder

Contains business features.

```text
features/

dashboard/

quests/

calendar/

progress/

health/

finance/

notes/

statistics/

settings/
```

Each feature owns:

Components

Hooks

Services

Types

---

Example

```text
features/

health/

components/

hooks/

services/

types/
```

---

# 9. Database Folder

Contains Dexie schema.

```text
database/

db.ts

tables/

migrations/
```

---

Example

```text
database/

tables/

users.ts

quests.ts

notes.ts

expenses.ts
```

---

# 10. Services Folder

Contains business logic.

Example

```text
services/

xp.service.ts

rank.service.ts

streak.service.ts

backlog.service.ts

nutrition.service.ts

finance.service.ts
```

---

Rule:

Components never calculate.

Services calculate.

---

# 11. Hooks Folder

Contains reusable logic.

Example

```text
hooks/

useXP.ts

useStreak.ts

useBacklog.ts

useCalories.ts

useWeight.ts
```

---

Purpose

Separate logic from UI.

---

# 12. Store Folder

Contains Zustand stores.

```text
store/

user.store.ts

quest.store.ts

health.store.ts

finance.store.ts

settings.store.ts
```

---

# 13. Types Folder

Contains shared types.

```text
types/

user.ts

quest.ts

note.ts

expense.ts

health.ts
```

---

Example

```typescript
export interface Quest {
  id: string;
  title: string;
  type: QuestType;
  xpReward: number;
}
```

---

# 14. Constants Folder

Contains static values.

```text
constants/

xp.ts

ranks.ts

quests.ts

achievements.ts
```

---

Example

```typescript
export const RANKS = [
  "E Rank",
  "D Rank",
  "C Rank",
  "B Rank",
  "A Rank",
  "S Rank"
];
```

---

# 15. Dashboard Architecture

Dashboard loads:

```text
Stats

Today's Quests

Backlogs

Weekly Goals

Calendar
```

Each module fetches independently.

---

Benefits

Fast rendering

Partial loading

Easy maintenance

---

# 16. Quest Architecture

Quest System

```text
Quest

↓

Quest Log

↓

XP Reward

↓

Stats Update

↓

Calendar Update
```

---

Example

Complete Striver

↓

Add XP

↓

Add Coins

↓

Increase Intelligence

↓

Update Calendar

---

# 17. XP Service

Responsible for:

```text
Grant XP

Calculate XP

Track XP History

Handle Promotions
```

---

Methods

```typescript
addXP()

removeXP()

getTotalXP()

getCurrentRank()
```

---

# 18. Rank Service

Responsible for:

```text
Rank Progression

Rank Promotions

Rank Rewards
```

---

Methods

```typescript
getRank()

promoteRank()

rankProgress()
```

---

# 19. Backlog Service

Most important service.

Responsible for:

```text
Creating Backlogs

Merging Backlogs

Resolving Backlogs
```

---

Methods

```typescript
createBacklog()

resolveBacklog()

getActiveBacklogs()
```

---

# 20. Streak Service

Responsible for:

```text
Streak Calculation

Skip Pass Logic

Milestone Rewards
```

---

Methods

```typescript
updateStreak()

breakStreak()

applySkipPass()
```

---

# 21. Health Service

Responsible for:

```text
Calories

Protein

Weight

Progress
```

---

Methods

```typescript
addFood()

calculateCalories()

calculateProtein()

updateWeight()
```

---

# 22. Finance Service

Responsible for:

```text
Expenses

Spending Trends

Wealth Calculation
```

---

Methods

```typescript
addExpense()

monthlySpend()

categoryBreakdown()
```

---

# 23. Notes Service

Responsible for:

```text
Create Notes

Update Notes

Delete Notes

Search Notes
```

---

Methods

```typescript
createNote()

updateNote()

searchNotes()
```

---

# 24. Search Architecture

Global Search

Ctrl + K

Searches:

```text
Notes

Progress Nodes

Bosses

Expenses

Tasks
```

---

Implementation

```text
Fuse.js
```

---

# 25. PWA Architecture

Version 1 includes:

```text
Installable

Offline

Caching

Background Sync Ready
```

---

Files

```text
manifest.json

service-worker.ts
```

---

# 26. Backup Architecture

Export

```json
{
  "user": {},
  "quests": [],
  "notes": [],
  "expenses": []
}
```

---

Import

Restore entire application state.

---

# 27. Sync Architecture (Future)

Version 2

Optional Sync

---

Flow

```text
Local Database

↓

Sync Queue

↓

Supabase

↓

Other Devices
```

---

Conflict Strategy

```text
Last Write Wins
```

---

# 28. Android Strategy

Phase 1

PWA

---

Phase 2

Capacitor

---

Phase 3

Native Android Features

---

No React Native required.

---

# 29. Linux Desktop Strategy

Phase 1

Browser

---

Phase 2

Tauri

---

Benefits

```text
Small Size

Fast Startup

Native Feel
```

---

# 30. Future AI Architecture

AI Layer sits separately.

```text
AI

↓

Reads Data

↓

Generates Insights

↓

Returns Suggestions
```

---

AI cannot:

```text
Grant XP

Modify Coins

Complete Tasks
```

---

AI only advises.

---

# 31. Security Principles

No authentication required.

No cloud dependency.

No third-party tracking.

No analytics.

No ads.

No user profiling.

User owns data.

---

# 32. Performance Targets

First Load

< 1 second

---

Dashboard

< 500ms

---

Search

< 200ms

---

Calendar

< 300ms

---

# 33. Development Order

Build in this sequence:

1. Database
2. Zustand Stores
3. XP System
4. Quest System
5. Dashboard
6. Calendar
7. Notes
8. Health
9. Finance
10. Progress Trees
11. Boss Battles
12. Statistics
13. Backup System
14. PWA
15. Sync

---

# 34. MVP Definition

The MVP is complete when:

✓ Daily Quests Work

✓ XP Works

✓ Coins Work

✓ Streaks Work

✓ Backlogs Work

✓ Notes Work

✓ Health Tracking Works

✓ Finance Tracking Works

✓ Progress Trees Work

✓ Dashboard Works

Everything else is secondary.

---

End of Part 8
# Leveling Up

# Part 9 – AI Systems, Intelligence Layer & Future Expansion

Version 1.0

---

# 1. Purpose

This document defines all AI-powered systems planned for Leveling Up.

Important:

AI is NOT the core product.

The core product remains:

* Progress Tracking
* Accountability
* Consistency

AI exists to assist.

AI must never replace user effort.

---

# 2. AI Philosophy

The AI should function like:

A mentor

A coach

A strategist

A reviewer

---

The AI should NOT function like:

A motivational speaker

A therapist

A replacement for discipline

---

# 3. AI Architecture

The AI layer sits above all modules.

```text
User Data

↓

AI Analysis Layer

↓

Insights

↓

Recommendations
```

---

AI receives:

* Tasks
* Progress
* Health Data
* Finance Data
* Learning Data

---

AI returns:

* Suggestions
* Reviews
* Reports
* Predictions

---

# 4. AI Permissions

AI CAN:

Analyze

Recommend

Summarize

Predict

---

AI CANNOT:

Complete Tasks

Modify XP

Modify Coins

Modify Streaks

Modify Backlogs

Grant Achievements

---

The system remains fair.

---

# 5. AI Food Parser

One of the most useful AI features.

---

User Input

```text
4 eggs
500ml milk
2 bananas
```

---

AI Output

```text
Calories

820 kcal

Protein

42g

Carbs

58g

Fat

29g
```

---

Auto Updates

Nutrition Dashboard

Vitality Stats

Health Logs

---

# 6. Food Intelligence Engine

Future Enhancement

AI recognizes:

Indian foods

Hostel foods

Mess foods

Street foods

---

Examples

```text
Rajma Chawal

Paneer Paratha

Aloo Paratha

Chicken Biryani

Soya Chunks

Dal Rice
```

---

AI estimates:

Calories

Protein

Micronutrients

---

# 7. Weight Gain Coach

Based on:

Current Weight

Target Weight

Daily Nutrition

Progress Rate

---

Current Profile

```text
Height

6'2

Weight

56kg

Goal

65kg
```

---

AI Recommendation Example

```text
Weight gain slower than expected.

Increase calories by 250/day.

Add:
2 Bananas

500ml Milk

50g Peanuts
```

---

# 8. Smart Nutrition Warnings

Example

```text
Protein below target
for 5 consecutive days.
```

---

AI Response

```text
Increase:

Eggs

Milk

Soya Chunks
```

---

# 9. AI Weekly Review

Every Sunday

Generate report.

---

Example

```text
Weekly Summary

XP Earned:
1270

Quests Completed:
81%

Backlogs Created:
6

Backlogs Cleared:
4

Weight Change:
+0.2kg
```

---

AI Insight

```text
Biggest weakness:

Protein consistency

Biggest strength:

DSA completion
```

---

# 10. AI Monthly Review

Larger review.

---

Example

```text
Monthly Report

Completion:
84%

Longest Streak:
26 Days

Most Consistent Area:
Web Development

Weakest Area:
Finance Tracking
```

---

Includes:

Recommendations

Warnings

Achievements

---

# 11. AI Learning Coach

Analyzes:

Progress Trees

Backlogs

Learning Goals

---

Current Goals

```text
Striver

Web Development

LeetCode

Codeforces

CS50x

CS50P
```

---

AI Suggestion Example

```text
You are attempting
6 major learning goals.

Recommendation:

Focus on:

Striver

Web Development

Codeforces

Reduce CS50 workload this week.
```

---

# 12. AI Quest Generator

User Prompt

```text
I want to learn React
in 3 months.
```

---

AI Creates

Daily Quests

Weekly Quests

Boss Battles

Progress Tree

---

Generated Example

```text
Week 1

JS Fundamentals

Week 2

Components

Week 3

Props

Week 4

State
```

---

# 13. AI Roadmap Generator

Creates learning plans.

---

Example

```text
Goal:

Become Full Stack Developer
```

---

Output

```text
HTML

CSS

JavaScript

React

Backend

Database

Deployment
```

---

Converted directly into Progress Tree.

---

# 14. AI DSA Coach

Reads:

LeetCode

Codeforces

Striver Progress

---

Example

```text
Arrays:
90%

Recursion:
20%

Trees:
0%
```

---

Recommendation

```text
Move to Trees.

Do not continue Arrays.
```

---

# 15. AI Backlog Analysis

Analyzes:

Repeatedly missed tasks.

---

Example

```text
Missed:

Protein Goal

12 times

Past 30 days
```

---

AI Insight

```text
Goal unrealistic.

Reduce target
or improve meal planning.
```

---

# 16. Doom Scroll Intelligence

User manually logs:

Instagram

Reels

Shorts

---

AI detects patterns.

---

Example

```text
High scrolling
occurs after 10 PM.
```

---

Suggestion

```text
Avoid phone
after 10 PM.

Use reading quest instead.
```

---

# 17. Focus Analysis

Measures:

Productive Work

vs

Distraction

---

Example

```text
Learning Time

18 Hours

Scrolling Time

11 Hours
```

---

AI generates ratio.

---

# 18. Finance Intelligence

Analyzes spending.

---

Example

```text
Food:
₹4200

Tea:
₹1200

Snacks:
₹2800
```

---

AI Recommendation

```text
Reduce snacks.

Increase milk purchases.
```

---

Supports weight gain goals.

---

# 19. Academic Coach

Tracks:

CGPA

Assignments

Attendance

---

Current

```text
CGPA

8.81
```

Target

```text
9.20
```

---

AI estimates:

Required semester GPA.

---

Example

```text
Need 9.55 GPA
next semester
to reach target.
```

---

# 20. Achievement Insights

AI identifies milestones.

---

Example

```text
100 Problems Solved

Achievement unlocked.
```

---

Provides summary.

---

# 21. Life Trend Analysis

Analyzes:

Months

Semesters

Years

---

Finds relationships.

---

Example

```text
Higher protein intake

↓

Better consistency

↓

More XP earned
```

---

# 22. Smart Search

Future Feature

Search naturally.

---

User Types

```text
Show all notes
about hackathons.
```

---

AI Returns

Relevant Notes

Tasks

Ideas

Projects

---

# 23. AI Memory Layer

Maintains context.

---

Example

AI remembers:

```text
Target Weight

65kg

Target CGPA

9.2

Current Learning Focus

Striver
```

---

Uses context for recommendations.

---

# 24. AI Safety Rules

AI must never:

Shame user

Manipulate user

Invent progress

Create fake achievements

Grant rewards

---

AI only analyzes.

---

# 25. Future Expansion Modules

Version 2

---

Internship Tracker

```text
Applications

Interviews

Offers
```

---

Resume Tracker

```text
Projects

Achievements

Skills
```

---

Hackathon Tracker

```text
Participations

Wins

Ideas
```

---

Version 3

---

CLI Version

```bash
solo today

solo stats

solo backlog
```

---

Linux Desktop

---

Android Native

---

Version 4

---

Knowledge Graph

Personal Wiki

Project Management

Second Brain

---

# 26. Final AI Principle

AI exists to improve decision-making.

Not to remove responsibility.

The player still performs the work.

The AI only acts as a guide.

---

End of Part 9
# Leveling Up

# Part 9 – AI Systems, Intelligence Layer & Future Expansion

Version 1.0

---

# 1. Purpose

This document defines all AI-powered systems planned for Leveling Up.

Important:

AI is NOT the core product.

The core product remains:

* Progress Tracking
* Accountability
* Consistency

AI exists to assist.

AI must never replace user effort.

---

# 2. AI Philosophy

The AI should function like:

A mentor

A coach

A strategist

A reviewer

---

The AI should NOT function like:

A motivational speaker

A therapist

A replacement for discipline

---

# 3. AI Architecture

The AI layer sits above all modules.

```text
User Data

↓

AI Analysis Layer

↓

Insights

↓

Recommendations
```

---

AI receives:

* Tasks
* Progress
* Health Data
* Finance Data
* Learning Data

---

AI returns:

* Suggestions
* Reviews
* Reports
* Predictions

---

# 4. AI Permissions

AI CAN:

Analyze

Recommend

Summarize

Predict

---

AI CANNOT:

Complete Tasks

Modify XP

Modify Coins

Modify Streaks

Modify Backlogs

Grant Achievements

---

The system remains fair.

---

# 5. AI Food Parser

One of the most useful AI features.

---

User Input

```text
4 eggs
500ml milk
2 bananas
```

---

AI Output

```text
Calories

820 kcal

Protein

42g

Carbs

58g

Fat

29g
```

---

Auto Updates

Nutrition Dashboard

Vitality Stats

Health Logs

---

# 6. Food Intelligence Engine

Future Enhancement

AI recognizes:

Indian foods

Hostel foods

Mess foods

Street foods

---

Examples

```text
Rajma Chawal

Paneer Paratha

Aloo Paratha

Chicken Biryani

Soya Chunks

Dal Rice
```

---

AI estimates:

Calories

Protein

Micronutrients

---

# 7. Weight Gain Coach

Based on:

Current Weight

Target Weight

Daily Nutrition

Progress Rate

---

Current Profile

```text
Height

6'2

Weight

56kg

Goal

65kg
```

---

AI Recommendation Example

```text
Weight gain slower than expected.

Increase calories by 250/day.

Add:
2 Bananas

500ml Milk

50g Peanuts
```

---

# 8. Smart Nutrition Warnings

Example

```text
Protein below target
for 5 consecutive days.
```

---

AI Response

```text
Increase:

Eggs

Milk

Soya Chunks
```

---

# 9. AI Weekly Review

Every Sunday

Generate report.

---

Example

```text
Weekly Summary

XP Earned:
1270

Quests Completed:
81%

Backlogs Created:
6

Backlogs Cleared:
4

Weight Change:
+0.2kg
```

---

AI Insight

```text
Biggest weakness:

Protein consistency

Biggest strength:

DSA completion
```

---

# 10. AI Monthly Review

Larger review.

---

Example

```text
Monthly Report

Completion:
84%

Longest Streak:
26 Days

Most Consistent Area:
Web Development

Weakest Area:
Finance Tracking
```

---

Includes:

Recommendations

Warnings

Achievements

---

# 11. AI Learning Coach

Analyzes:

Progress Trees

Backlogs

Learning Goals

---

Current Goals

```text
Striver

Web Development

LeetCode

Codeforces

CS50x

CS50P
```

---

AI Suggestion Example

```text
You are attempting
6 major learning goals.

Recommendation:

Focus on:

Striver

Web Development

Codeforces

Reduce CS50 workload this week.
```

---

# 12. AI Quest Generator

User Prompt

```text
I want to learn React
in 3 months.
```

---

AI Creates

Daily Quests

Weekly Quests

Boss Battles

Progress Tree

---

Generated Example

```text
Week 1

JS Fundamentals

Week 2

Components

Week 3

Props

Week 4

State
```

---

# 13. AI Roadmap Generator

Creates learning plans.

---

Example

```text
Goal:

Become Full Stack Developer
```

---

Output

```text
HTML

CSS

JavaScript

React

Backend

Database

Deployment
```

---

Converted directly into Progress Tree.

---

# 14. AI DSA Coach

Reads:

LeetCode

Codeforces

Striver Progress

---

Example

```text
Arrays:
90%

Recursion:
20%

Trees:
0%
```

---

Recommendation

```text
Move to Trees.

Do not continue Arrays.
```

---

# 15. AI Backlog Analysis

Analyzes:

Repeatedly missed tasks.

---

Example

```text
Missed:

Protein Goal

12 times

Past 30 days
```

---

AI Insight

```text
Goal unrealistic.

Reduce target
or improve meal planning.
```

---

# 16. Doom Scroll Intelligence

User manually logs:

Instagram

Reels

Shorts

---

AI detects patterns.

---

Example

```text
High scrolling
occurs after 10 PM.
```

---

Suggestion

```text
Avoid phone
after 10 PM.

Use reading quest instead.
```

---

# 17. Focus Analysis

Measures:

Productive Work

vs

Distraction

---

Example

```text
Learning Time

18 Hours

Scrolling Time

11 Hours
```

---

AI generates ratio.

---

# 18. Finance Intelligence

Analyzes spending.

---

Example

```text
Food:
₹4200

Tea:
₹1200

Snacks:
₹2800
```

---

AI Recommendation

```text
Reduce snacks.

Increase milk purchases.
```

---

Supports weight gain goals.

---

# 19. Academic Coach

Tracks:

CGPA

Assignments

Attendance

---

Current

```text
CGPA

8.81
```

Target

```text
9.20
```

---

AI estimates:

Required semester GPA.

---

Example

```text
Need 9.55 GPA
next semester
to reach target.
```

---

# 20. Achievement Insights

AI identifies milestones.

---

Example

```text
100 Problems Solved

Achievement unlocked.
```

---

Provides summary.

---

# 21. Life Trend Analysis

Analyzes:

Months

Semesters

Years

---

Finds relationships.

---

Example

```text
Higher protein intake

↓

Better consistency

↓

More XP earned
```

---

# 22. Smart Search

Future Feature

Search naturally.

---

User Types

```text
Show all notes
about hackathons.
```

---

AI Returns

Relevant Notes

Tasks

Ideas

Projects

---

# 23. AI Memory Layer

Maintains context.

---

Example

AI remembers:

```text
Target Weight

65kg

Target CGPA

9.2

Current Learning Focus

Striver
```

---

Uses context for recommendations.

---

# 24. AI Safety Rules

AI must never:

Shame user

Manipulate user

Invent progress

Create fake achievements

Grant rewards

---

AI only analyzes.

---

# 25. Future Expansion Modules

Version 2

---

Internship Tracker

```text
Applications

Interviews

Offers
```

---

Resume Tracker

```text
Projects

Achievements

Skills
```

---

Hackathon Tracker

```text
Participations

Wins

Ideas
```

---

Version 3

---

CLI Version

```bash
solo today

solo stats

solo backlog
```

---

Linux Desktop

---

Android Native

---

Version 4

---

Knowledge Graph

Personal Wiki

Project Management

Second Brain

---

# 26. Final AI Principle

AI exists to improve decision-making.

Not to remove responsibility.

The player still performs the work.

The AI only acts as a guide.

---

End of Part 9
# Leveling Up

# Part 10 – Complete Development Roadmap

Version 1.0

---

# 1. Purpose

This roadmap defines:

* Development phases
* Build order
* Milestones
* Deliverables
* Future expansion path

The goal is to avoid feature creep.

Build the foundation first.

Add intelligence later.

---

# 2. Development Philosophy

Rules:

1. Build core functionality before AI.
2. Build offline-first before sync.
3. Build desktop-quality UI before mobile optimization.
4. Never build features without a clear purpose.
5. Complete one module before starting another.

---

# 3. Project Phases

```text
Phase 0
Planning

↓

Phase 1
Core Foundation

↓

Phase 2
Productivity Engine

↓

Phase 3
Health & Finance

↓

Phase 4
Progression System

↓

Phase 5
Analytics

↓

Phase 6
Backup & Sync

↓

Phase 7
AI Layer

↓

Phase 8
Android & Desktop
```

---

# Phase 0

# Project Setup

Duration

1 Day

---

Deliverables

React Setup

TypeScript

Tailwind

shadcn/ui

Dexie

Zustand

Routing

Theme System

Folder Structure

---

Tasks

Create Project

Setup Theme

Create Database

Setup Stores

Setup Layout

Create Sidebar

Create Topbar

---

Goal

Application skeleton ready.

---

# Phase 1

# Core Foundation

Duration

2–3 Days

---

# Module 1

User Profile

---

Features

Store:

Name

Weight

CGPA

Goals

---

Screens

First Time Setup

Profile

---

# Module 2

Quest System

---

Features

Create Quest

Update Quest

Delete Quest

Complete Quest

Quest History

---

Quest Types

Binary

Count

Time

Progress

---

Goal

Quest engine operational.

---

# Module 3

XP System

---

Features

Add XP

Track XP

XP History

Rank Calculation

---

Goal

Progression working.

---

# Module 4

Coin System

---

Features

Add Coins

Spend Coins

Coin Logs

Reward Shop

---

Goal

Economy working.

---

# Phase 2

# Productivity Engine

Duration

3–5 Days

---

# Dashboard

Features

Today's Quests

Weekly Goals

Backlogs

XP

Coins

Rank

---

Goal

Main screen complete.

---

# Calendar

Features

Monthly View

Daily Logs

Heatmap

History

---

Goal

Progress visible.

---

# Notes

Features

Create Note

Edit Note

Delete Note

Search Note

Tags

---

Goal

Idea capture complete.

---

# Backlog System

Features

Generate Backlogs

Resolve Backlogs

Track Debt

---

Goal

Accountability system complete.

---

# Phase 3

# Health & Finance

Duration

3–4 Days

---

# Weight Tracking

Features

Weight History

Weight Goal

Progress Graph

---

# Nutrition

Features

Calories

Protein

Food Logs

Nutrition Summary

---

# Finance

Features

Expense Logging

Categories

Monthly Summary

Trends

---

Goal

Health and money tracking complete.

---

# Phase 4

# Progression System

Duration

4–5 Days

---

# Progress Trees

Features

DSA Tree

Development Tree

Academic Tree

Health Tree

Finance Tree

---

# Boss Battles

Features

Boss Cards

Rewards

Unlock Logic

Completion Tracking

---

# Achievements

Features

Milestones

Titles

Achievements

---

Goal

Life progression visible.

---

# Phase 5

# Analytics

Duration

2–3 Days

---

Statistics

Features

XP Trends

Completion Trends

Streak Trends

Weight Trends

Expense Trends

---

Weekly Reports

Monthly Reports

---

Goal

Insights available.

---

# Phase 6

# Backup & Sync

Duration

2 Days

---

Backup

Features

JSON Export

JSON Import

Restore

---

Sync

Features

Optional Sync

Manual Sync

Conflict Handling

---

Goal

Data safety.

---

# Phase 7

# AI Layer

Duration

5–10 Days

---

# AI Food Parser

Input

```text
4 eggs
500ml milk
2 bananas
```

Output

Calories

Protein

Macros

---

# AI Weekly Review

Generate:

Strengths

Weaknesses

Suggestions

---

# AI Learning Coach

Suggest:

Learning Priorities

Roadmaps

Goal Adjustments

---

# AI Backlog Coach

Analyze:

Missed Tasks

Consistency

Trends

---

Goal

AI becomes advisor.

---

# Phase 8

# Platform Expansion

Duration

Future

---

# Android

PWA

↓

Capacitor

↓

Native Features

---

# Desktop

Browser

↓

Tauri

↓

Native Linux App

---

# CLI

Examples

```bash
solo today

solo backlog

solo stats

solo note
```

---

Goal

Everywhere access.

---

# MVP Definition

Version 0.1

Must Have

✓ User Setup

✓ Quests

✓ XP

✓ Coins

✓ Dashboard

✓ Calendar

✓ Notes

✓ Backlogs

---

# Beta Definition

Version 0.5

Must Have

✓ Health

✓ Finance

✓ Progress Trees

✓ Boss Battles

✓ Achievements

---

# Version 1.0

Must Have

✓ Analytics

✓ Reports

✓ Backup

✓ PWA

✓ Complete UI

---

# Version 2.0

Must Have

✓ AI Food Parser

✓ AI Reviews

✓ AI Recommendations

✓ Sync

---

# Version 3.0

Must Have

✓ Android App

✓ Linux Desktop

✓ CLI

---

# Estimated Development Time

Beginner Developer

2–3 Months

---

Intermediate Developer

4–6 Weeks

---

AI-Assisted Development

2–3 Weeks

---

# Recommended Build Order

If building with AI:

Week 1

Database

Quests

XP

Coins

Dashboard

---

Week 2

Calendar

Notes

Health

Finance

---

Week 3

Progress Trees

Boss Battles

Achievements

Analytics

---

Week 4

Polish

Testing

Backup

PWA

---

# Success Criteria

Leveling Up is successful when:

The user opens it every day.

The dashboard immediately shows:

* What must be done
* What was missed
* What progress was made
* What goal is closest to completion

without requiring any additional tools.

---

End of Part 10
# Leveling Up

# Part 11 – Engineering Specification & AI Coding Agent Blueprint

Version 1.0

---

# 1. Purpose

This document is the final technical blueprint.

It is intended for:

* Developers
* AI Coding Agents
* Future Contributors
* Yourself

The goal is that someone can build Leveling Up without needing any additional explanation.

---

# 2. System Overview

```text
┌─────────────────────────┐
│        React UI         │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│      Zustand Store      │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│        Services         │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│      Dexie Layer        │
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│       IndexedDB         │
└─────────────────────────┘
```

---

# 3. Folder Structure

```text
src/

├── app/
├── pages/
├── layouts/

├── components/
│   ├── ui/
│   ├── cards/
│   ├── charts/
│   ├── modals/
│   ├── forms/
│   └── calendar/

├── features/
│   ├── dashboard/
│   ├── quests/
│   ├── progress/
│   ├── health/
│   ├── finance/
│   ├── notes/
│   ├── analytics/
│   └── settings/

├── database/
│   ├── db.ts
│   ├── schema.ts
│   └── migrations/

├── services/

├── store/

├── hooks/

├── types/

├── constants/

└── utils/
```

---

# 4. Core TypeScript Interfaces

## User

```typescript
export interface User {
  id: string;
  name: string;

  currentWeight: number;
  targetWeight: number;

  currentCgpa: number;
  targetCgpa: number;

  createdAt: string;
  updatedAt: string;
}
```

---

## Quest

```typescript
export interface Quest {
  id: string;

  title: string;

  category:
    | "dsa"
    | "development"
    | "health"
    | "finance"
    | "notes";

  type:
    | "binary"
    | "count"
    | "time"
    | "progress";

  target: number;

  currentValue: number;

  xpReward: number;

  coinReward: number;

  active: boolean;
}
```

---

## QuestLog

```typescript
export interface QuestLog {
  id: string;

  questId: string;

  date: string;

  completed: boolean;

  progress: number;

  xpEarned: number;

  coinsEarned: number;
}
```

---

## Backlog

```typescript
export interface Backlog {
  id: string;

  sourceQuestId: string;

  amount: number;

  createdAt: string;

  resolved: boolean;
}
```

---

## Stats

```typescript
export interface Stats {
  intelligence: number;

  builder: number;

  discipline: number;

  vitality: number;

  wealth: number;
}
```

---

# 5. Dexie Database Definition

```typescript
class SoloLevelingDB extends Dexie {
  users!: Table<User>;
  quests!: Table<Quest>;
  questLogs!: Table<QuestLog>;
  backlogs!: Table<Backlog>;

  notes!: Table<Note>;

  expenses!: Table<Expense>;

  weightLogs!: Table<WeightLog>;

  foodLogs!: Table<FoodLog>;

  achievements!: Table<Achievement>;

  progressNodes!: Table<ProgressNode>;

  bosses!: Table<Boss>;

  settings!: Table<Settings>;

  constructor() {
    super("solo_leveling");

    this.version(1).stores({
      users: "id",

      quests: "id",

      questLogs: "id,date",

      backlogs: "id",

      notes: "id,title",

      expenses: "id,date",

      weightLogs: "id,date",

      foodLogs: "id,date",

      achievements: "id",

      progressNodes: "id",

      bosses: "id",

      settings: "id"
    });
  }
}
```

---

# 6. Zustand Stores

Store philosophy:

Only UI state goes into Zustand.

Permanent data stays in IndexedDB.

---

## User Store

```typescript
interface UserStore {
  user: User | null;

  setUser: () => void;

  updateUser: () => void;
}
```

---

## Quest Store

```typescript
interface QuestStore {
  dailyQuests: Quest[];

  weeklyQuests: Quest[];

  completeQuest: () => void;

  updateProgress: () => void;
}
```

---

## Dashboard Store

```typescript
interface DashboardStore {
  xp: number;

  rank: string;

  streak: number;

  coins: number;
}
```

---

# 7. Service Layer Responsibilities

Services contain ALL business logic.

Never calculate inside components.

---

## XP Service

```typescript
addXP()

removeXP()

getTotalXP()

calculateLevel()

calculateRank()
```

---

## Coin Service

```typescript
addCoins()

removeCoins()

purchaseReward()
```

---

## Backlog Service

```typescript
createBacklog()

mergeBacklogs()

resolveBacklog()
```

---

## Health Service

```typescript
addFood()

calculateCalories()

calculateProtein()

updateWeight()
```

---

## Finance Service

```typescript
addExpense()

monthlySummary()

weeklySummary()
```

---

# 8. Dashboard Data Flow

```text
Dashboard

↓

Load User

↓

Load Quests

↓

Load Stats

↓

Load Backlogs

↓

Load Calendar Summary

↓

Render
```

---

# 9. Quest Completion Flow

```text
Complete Quest

↓

Update Quest Log

↓

Grant XP

↓

Grant Coins

↓

Update Stats

↓

Update Calendar

↓

Refresh Dashboard
```

---

# 10. Backlog Flow

```text
Miss Quest

↓

Daily Reset

↓

Create Backlog

↓

Display Backlog

↓

User Completes Work

↓

Backlog Reduced

↓

Backlog Cleared
```

---

# 11. Progress Tree Flow

```text
Solve Question

↓

Progress Node Updated

↓

Node Complete

↓

Boss Unlocked

↓

Boss Defeated

↓

Achievement Granted
```

---

# 12. Component Hierarchy

Dashboard

```text
DashboardPage

├── RankCard

├── XPCard

├── CoinCard

├── StreakCard

├── QuestPanel

├── WeeklyPanel

├── BacklogPanel

├── CalendarPanel

└── SummaryPanel
```

---

# 13. Calendar Hierarchy

```text
CalendarPage

├── MonthHeader

├── CalendarGrid

│   └── CalendarCell

└── DayDetailModal
```

---

# 14. Health Hierarchy

```text
HealthPage

├── WeightCard

├── CalorieCard

├── ProteinCard

├── FoodEntryForm

└── WeightChart
```

---

# 15. Notes Hierarchy

```text
NotesPage

├── SearchBar

├── NotesList

└── NoteEditor
```

---

# 16. Error Handling

If IndexedDB fails:

```text
Display Error

Offer Backup Export

Prevent Data Loss
```

---

All services return:

```typescript
{
  success: boolean;

  data?: T;

  error?: string;
}
```

---

# 17. Backup Format

Export file:

```json
{
  "version": "1.0",

  "user": {},

  "quests": [],

  "notes": [],

  "expenses": [],

  "weightLogs": [],

  "foodLogs": []
}
```

---

# 18. Testing Strategy

Unit Tests

```text
XP Service

Coin Service

Backlog Service

Health Service
```

---

Integration Tests

```text
Quest Completion

Calendar Updates

Progress Tree Updates
```

---

# 19. AI Coding Agent Prompt Structure

When building modules:

Prompt Format:

```text
Build the Dashboard module.

Requirements:

- React
- TypeScript
- Tailwind
- shadcn

Features:

- Rank Card
- XP Card
- Coin Card
- Streak Card

Follow Leveling Up Documentation.

Return production-ready code.
```

---

# 20. AI Development Order

Cursor / Claude Code / Copilot

Build in sequence:

1. Database
2. Types
3. Services
4. Stores
5. Dashboard
6. Quest System
7. Calendar
8. Notes
9. Health
10. Finance
11. Progress
12. Analytics
13. Backup

Never skip order.

---

# 21. Code Standards

All files:

```text
Strict TypeScript

No any

ESLint

Prettier
```

---

Functions:

```text
Single Responsibility

Pure Logic Preferred

Small Components
```

---

# 22. Performance Requirements

Dashboard:

< 500ms

---

Calendar:

< 300ms

---

Search:

< 200ms

---

Initial Load:

< 1 second

---

# 23. Security Principles

No tracking

No analytics

No ads

No external data collection

No telemetry

User owns everything.

---

# 24. Final Engineering Principle

Every feature must answer:

"Does this help the user level up?"

If not:

Do not build it.

---

END OF PART 11

COMPLETE Leveling Up SPECIFICATION v1.0
# Leveling Up

# Part 12 – User Stories, MVP Sprint Plan & Development Tasks

Version 1.0

---

# 1. Purpose

This document converts requirements into development tasks.

Every feature must be represented by:

* User Story
* Acceptance Criteria
* Development Tasks

This becomes the implementation roadmap.

---

# 2. MVP Goal

The MVP is successful if:

The user can:

* Track daily progress
* Track weekly goals
* Earn XP
* Earn Coins
* Build streaks
* Create notes
* Track weight
* Track calories
* Track expenses
* Review progress

without requiring any other app.

---

# 3. Epic 1 – User Profile

## User Story

As a user,

I want to setup my profile

so that Leveling Up can track my goals.

---

## Acceptance Criteria

User can enter:

Name

Current Weight

Target Weight

Current CGPA

Target CGPA

---

Data persists after refresh.

---

## Tasks

Create User Model

Create Setup Screen

Create User Service

Create User Store

Persist User

---

# 4. Epic 2 – Daily Quest System

## User Story

As a user,

I want to complete daily quests

so that I can earn XP.

---

Acceptance Criteria

Display all active quests.

Mark quest complete.

Update XP.

Update Coins.

Update Stats.

---

Tasks

Quest Schema

Quest Service

Quest Store

Quest UI

Quest Logs

---

# 5. Epic 3 – Weekly Goals

## User Story

As a user,

I want weekly goals

so that I focus on long-term progress.

---

Acceptance Criteria

Track:

LeetCode

Codeforces

CS50x

CS50P

---

Tasks

Weekly Goal Model

Weekly Goal UI

Weekly Progress Logic

Weekly Reset Logic

---

# 6. Epic 4 – XP System

## User Story

As a user,

I want visible progression

so that I stay motivated.

---

Acceptance Criteria

XP increases.

Rank updates.

History stored.

---

Tasks

XP Service

XP Table

Rank Calculator

XP Logs

---

# 7. Epic 5 – Coin Economy

## User Story

As a user,

I want rewards

so that consistency feels meaningful.

---

Acceptance Criteria

Earn Coins.

Spend Coins.

Track Balance.

---

Tasks

Coin Service

Coin Logs

Reward Shop

Coin UI

---

# 8. Epic 6 – Streak System

## User Story

As a user,

I want streaks

so that consistency becomes visible.

---

Acceptance Criteria

Maintain streak.

Break streak.

Restore via Skip Pass.

---

Tasks

Streak Service

Streak UI

Milestone Rewards

Skip Pass Logic

---

# 9. Epic 7 – Backlog System

## User Story

As a user,

I want missed work to remain visible

so that I remain accountable.

---

Acceptance Criteria

Missed tasks become backlog.

Backlogs stack.

Backlogs can be cleared.

---

Tasks

Backlog Model

Backlog Service

Backlog UI

Debt Tracking

---

# 10. Epic 8 – Dashboard

## User Story

As a user,

I want a central dashboard

so I immediately know what to do.

---

Acceptance Criteria

Display:

Rank

XP

Coins

Streak

Today's Quests

Backlogs

Weekly Goals

---

Tasks

Dashboard Layout

Stat Cards

Quest Panel

Backlog Panel

Weekly Panel

---

# 11. Epic 9 – Calendar

## User Story

As a user,

I want to review historical progress.

---

Acceptance Criteria

Monthly View

Daily Details

Completion Heatmap

---

Tasks

Calendar Grid

Day Modal

Calendar Logs

Heatmap Colors

---

# 12. Epic 10 – Notes

## User Story

As a user,

I want quick notes

so I never lose ideas.

---

Acceptance Criteria

Create

Edit

Delete

Search

---

Tasks

Notes Model

Notes Service

Editor UI

Search

---

# 13. Epic 11 – Health

## User Story

As a user,

I want to gain weight.

---

Acceptance Criteria

Track:

Weight

Calories

Protein

Food Logs

---

Tasks

Weight Module

Nutrition Module

Food Entry UI

Charts

---

# 14. Epic 12 – Finance

## User Story

As a user,

I want to track expenses.

---

Acceptance Criteria

Add Expense

View Monthly Total

View Categories

---

Tasks

Expense Model

Expense Form

Expense Analytics

---

# 15. Epic 13 – Progress Trees

## User Story

As a user,

I want long-term goals

so I see meaningful growth.

---

Acceptance Criteria

Progress Nodes

Completion %

Boss Unlocks

---

Tasks

Progress Models

Tree UI

Completion Logic

Boss Logic

---

# 16. Epic 14 – Statistics

## User Story

As a user,

I want analytics

so I understand trends.

---

Acceptance Criteria

Completion %

XP Trends

Streak Trends

Weight Trends

---

Tasks

Analytics Engine

Charts

Reports

Statistics Page

---

# 17. Sprint 1

Goal:

Core Foundation

Duration:

3 Days

---

Tasks

Project Setup

Dexie Setup

Types

Stores

User Setup

Theme

Sidebar

Dashboard Skeleton

---

# 18. Sprint 2

Goal:

Quest Engine

Duration:

4 Days

---

Tasks

Daily Quests

Weekly Goals

XP

Coins

Ranks

Quest Logs

---

# 19. Sprint 3

Goal:

Accountability Engine

Duration:

3 Days

---

Tasks

Streaks

Backlogs

Penalties

Reward Shop

---

# 20. Sprint 4

Goal:

Personal Management

Duration:

4 Days

---

Tasks

Notes

Health

Finance

Weight Tracking

Nutrition

---

# 21. Sprint 5

Goal:

Progress System

Duration:

4 Days

---

Tasks

Progress Trees

Boss Battles

Achievements

Statistics

---

# 22. Sprint 6

Goal:

Production Ready

Duration:

3 Days

---

Tasks

Testing

Bug Fixes

Optimization

PWA

Backup

Export

---

# 23. MVP Checklist

User Setup

Daily Quests

Weekly Goals

XP

Coins

Ranks

Backlogs

Streaks

Dashboard

Calendar

Notes

Health

Finance

Progress Trees

Statistics

Backup

---

# 24. Definition Of Done

A feature is complete only if:

UI Built

Logic Implemented

Data Stored

Refresh Safe

Offline Safe

Mobile Friendly

Type Safe

Tested

---

# 25. Release Criteria

Version 1.0 is ready when:

The user can rely on Leveling Up every day without needing:

Google Keep

Habit Tracker

Expense Tracker

Weight Tracker

Progress Spreadsheet

Notes App

for the supported features.

---

End of Part 12

# Leveling Up

# Part 13 – User Stories, Edge Cases & Production Rules

Version 1.0

---

# 1. Purpose

This document defines:

* Edge Cases
* Unexpected User Actions
* Failure Scenarios
* Recovery Logic
* Production Rules

Without these rules the application may behave unpredictably.

---

# 2. Quest System Edge Cases

---

## Case 1

User completes quest.

Then edits progress.

---

Example

Target:

2 Problems

Completed:

2 Problems

Quest Completed

XP Granted

---

User changes progress:

2 → 1

---

Rule

Quest becomes incomplete.

XP removed.

Coins removed.

Calendar updated.

Stats recalculated.

---

## Case 2

User completes quest twice.

---

Example

Complete Striver.

Click Complete again.

---

Rule

Ignore duplicate completion.

No extra XP.

No extra coins.

---

## Case 3

User deletes completed quest.

---

Rule

Keep historical logs.

Delete only future occurrences.

Past history remains.

---

# 3. Daily Reset Edge Cases

---

## Case 4

User closes app before midnight.

---

Rule

Reset occurs on next app launch.

---

## Case 5

User doesn't open app for 7 days.

---

Rule

Generate missed days.

Generate backlog.

Break streak.

Preserve history.

---

Example

7 missed days.

Backlogs accumulate.

---

## Case 6

User changes system clock.

---

Rule

Store last reset timestamp.

Prevent multiple resets.

---

# 4. Streak Edge Cases

---

## Case 7

Completion exactly 70%.

---

Rule

Streak continues.

---

## Case 8

Completion 69%.

---

Rule

Streak breaks.

---

## Case 9

User uses Skip Pass.

---

Rule

Streak preserved.

Tasks remain incomplete.

Backlogs still created.

---

## Case 10

User owns no Skip Pass.

---

Rule

Cannot restore streak.

---

# 5. Backlog Edge Cases

---

## Case 11

Backlog reaches 100+ tasks.

---

Rule

No limit.

Backlogs are reality.

---

## Case 12

User completes more than required.

---

Example

Backlog:

3 Problems

Today's Goal:

2 Problems

Completed:

7 Problems

---

Rule

Backlog cleared.

Today's goal cleared.

Extra progress ignored.

---

## Case 13

User changes target after backlog created.

---

Example

Old Goal:

5 Problems

New Goal:

2 Problems

---

Rule

Existing backlog remains.

Future backlog uses new target.

---

# 6. Weekly Goal Edge Cases

---

## Case 14

User changes weekly goal mid-week.

---

Rule

Recalculate remaining target.

Do not remove completed work.

---

Example

Old Goal:

7 Problems

Completed:

3

New Goal:

5

---

Progress:

3 / 5

---

## Case 15

Week ends with partial completion.

---

Rule

No rollover.

Weekly goals reset.

Completion recorded in history.

---

# 7. XP Edge Cases

---

## Case 16

User edits completed task.

---

Rule

Recalculate XP.

Adjust rank if required.

---

## Case 17

Negative XP.

---

Rule

Total XP never below zero.

---

## Case 18

Rank drops due to XP loss.

---

Rule

Ranks can decrease.

Progress reflects reality.

---

# 8. Coin Edge Cases

---

## Case 19

User spends more coins than owned.

---

Rule

Reject transaction.

---

## Case 20

Coin balance negative.

---

Rule

Impossible.

Minimum:

0

---

# 9. Health Edge Cases

---

## Case 21

User logs same meal twice.

---

Rule

Allow.

Meals may genuinely repeat.

---

## Case 22

User logs impossible calories.

---

Example

100000 kcal

---

Rule

Show warning.

Still allow save.

User owns data.

---

## Case 23

Weight decreases.

---

Rule

Track honestly.

No punishment.

---

## Case 24

Weight goal achieved.

---

Rule

Unlock boss.

Grant rewards.

Allow new goal.

---

# 10. Finance Edge Cases

---

## Case 25

Expense amount:

0

---

Rule

Reject.

---

## Case 26

Negative expense.

---

Rule

Use income entry instead.

---

## Case 27

User deletes expense.

---

Rule

Update all summaries.

---

# 11. Notes Edge Cases

---

## Case 28

Empty note.

---

Rule

Do not save.

---

## Case 29

Large note.

---

Rule

Unlimited length.

---

## Case 30

Duplicate title.

---

Rule

Allow.

---

# 12. Calendar Edge Cases

---

## Case 31

No activity day.

---

Rule

Generate empty entry.

---

## Case 32

Historical data edited.

---

Rule

Recalculate:

XP

Coins

Completion %

---

# 13. Progress Tree Edge Cases

---

## Case 33

Progress exceeds target.

---

Example

Target:

36

Completed:

40

---

Rule

Cap at 100%.

---

## Case 34

Node already complete.

---

Rule

No additional boss rewards.

---

# 14. Boss Battle Edge Cases

---

## Case 35

Boss reward already claimed.

---

Rule

Cannot claim twice.

---

## Case 36

Progress decreases after completion.

---

Example

User edits data.

---

Rule

Boss remains completed.

Rewards remain claimed.

---

# 15. Backup Edge Cases

---

## Case 37

Import older backup.

---

Rule

Warn user.

Allow restore.

---

## Case 38

Import corrupt file.

---

Rule

Reject.

Show error.

---

# 16. Search Edge Cases

---

## Case 39

No results.

---

Display:

```text
No results found.
```

---

## Case 40

Very large dataset.

---

Rule

Use indexed search.

---

# 17. Mobile Edge Cases

---

## Case 41

Offline usage.

---

Rule

Everything works.

---

## Case 42

App reinstalled.

---

Rule

Restore from backup.

---

# 18. Sync Edge Cases

Future Version

---

## Case 43

Same note edited on two devices.

---

Rule

Last Write Wins.

---

## Case 44

Device offline for 30 days.

---

Rule

Sync on reconnect.

---

# 19. AI Edge Cases

---

## Case 45

AI food parser unsure.

---

Rule

Show confidence score.

---

Example

```text
Estimated Calories

450 ± 100 kcal
```

---

## Case 46

AI recommendation conflicts with user goal.

---

Rule

User always wins.

---

# 20. Performance Rules

---

Dashboard

< 500ms

---

Search

< 200ms

---

Calendar

< 300ms

---

Startup

< 1s

---

# 21. Data Integrity Rules

XP must equal sum of XP logs.

Coins must equal sum of coin logs.

Progress must equal source data.

No hidden calculations.

---

# 22. Production Principle

Leveling Up must always show reality.

Not motivation.

Not guesses.

Not inflated progress.

Reality.

Even when reality looks bad.

Because accurate feedback creates growth.

---

# 23. Future User Stories (Examples)

As a user,
I want to see my backlog growing,
so I understand the cost of procrastination.

---

As a user,
I want calories tracked automatically,
so weight gain becomes measurable.

---

As a user,
I want every Striver topic represented as a progress node,
so I can see my DSA journey.

---

As a user,
I want weekly reviews,
so I understand what is working and what is not.

---

As a user,
I want my data stored locally,
so I remain in control.

---

END OF PART 13

# Leveling Up

# Part 14 – Personalized Progress Trees & Life Progression System

Version 1.0

User: Deepak Kumar

---

# 1. Purpose

Unlike generic productivity apps, Leveling Up ships with pre-configured life goals.

The system already knows:

* Current CGPA
* Current Weight
* Career Goal
* Learning Goals
* Technical Goals

This transforms Leveling Up from a tracker into a roadmap.

---

# 2. Main Storyline

The entire application revolves around one mission.

```text
MAIN QUEST

Become Internship Ready Software Engineer
Before Graduation
```

---

# Victory Conditions

By graduation:

✓ Strong DSA

✓ Strong Development Skills

✓ Internship

✓ Multiple Projects

✓ 65kg Weight

✓ CGPA Above 9

✓ Competitive Programming Experience

---

# 3. DSA Progress Tree

Category:

INTELLIGENCE

---

## Tier 1

Arrays

Target:

36 Problems

Reward:

500 XP

---

Difficulty:

Easy

---

Unlocks:

Recursion

---

## Tier 2

Recursion

Target:

18 Problems

Reward:

750 XP

---

Unlocks:

Hashing

---

## Tier 3

Hashing

Target:

20 Problems

Reward:

750 XP

---

Unlocks:

Sorting

---

## Tier 4

Sorting

Target:

20 Problems

Reward:

750 XP

---

Unlocks:

Binary Search

---

## Tier 5

Binary Search

Target:

25 Problems

Reward:

1000 XP

---

Unlocks:

Strings

---

## Tier 6

Strings

Target:

30 Problems

Reward:

1000 XP

---

Unlocks:

Linked List

---

## Tier 7

Linked List

Target:

35 Problems

Reward:

1200 XP

---

Unlocks:

Stacks & Queues

---

## Tier 8

Stacks & Queues

Target:

30 Problems

Reward:

1200 XP

---

Unlocks:

Trees

---

## Tier 9

Trees

Target:

50 Problems

Reward:

1500 XP

---

Unlocks:

BST

---

## Tier 10

Binary Search Trees

Target:

25 Problems

Reward:

1500 XP

---

Unlocks:

Graphs

---

## Tier 11

Graphs

Target:

60 Problems

Reward:

2000 XP

---

Unlocks:

Dynamic Programming

---

## Tier 12

Dynamic Programming

Target:

70 Problems

Reward:

3000 XP

---

Boss Title

```text
DSA MONARCH
```

Reward:

10000 XP

---

# 4. LeetCode Tree

Goal

300 Problems

---

Milestones

25 Problems

50 Problems

100 Problems

150 Problems

200 Problems

250 Problems

300 Problems

---

Rewards increase exponentially.

---

300 Problems

Reward

5000 XP

Title:

```text
LEETCODE HUNTER
```

---

# 5. Codeforces Tree

Goal

Regular Competitive Programmer

---

Tier 1

5 Problems

---

Tier 2

20 Problems

---

Tier 3

50 Problems

---

Tier 4

100 Problems

---

Tier 5

First Contest

---

Tier 6

5 Contests

---

Tier 7

10 Contests

---

Tier 8

First Rating Gain

---

Final Boss

100 Problems + 20 Contests

Reward

6000 XP

---

Title

```text
CODEFORCES WARRIOR
```

---

# 6. Web Development Tree

Category

BUILDER

---

Stage 1

HTML

---

Tasks

Semantic HTML

Forms

Accessibility

---

Reward

500 XP

---

Stage 2

CSS

---

Flexbox

Grid

Responsive Design

Animations

---

Reward

750 XP

---

Stage 3

JavaScript

---

Variables

Functions

Objects

DOM

Async

ES6

---

Reward

1500 XP

---

Stage 4

Git & GitHub

---

Commits

Branches

Pull Requests

---

Reward

1000 XP

---

Stage 5

React

---

Components

Props

State

Hooks

Routing

---

Reward

2000 XP

---

Stage 6

Backend

---

Node

Express

APIs

Authentication

---

Reward

2500 XP

---

Stage 7

Database

---

SQL

PostgreSQL

Supabase

---

Reward

2000 XP

---

Stage 8

Deployment

---

Netlify

Vercel

Docker

---

Reward

1500 XP

---

Boss

Full Stack Project

Reward

5000 XP

Title

```text
FULL STACK HUNTER
```

---

# 7. Project Tree

Current Goal

Build Strong Portfolio

---

Project 1

Leveling Up

---

Reward

3000 XP

---

Project 2

Full Stack Project

---

Reward

4000 XP

---

Project 3

Hackathon Project

---

Reward

5000 XP

---

Project 4

Resume Project

---

Reward

5000 XP

---

Boss

Portfolio Complete

Reward

10000 XP

---

# 8. CS50 Tree

Weekly Goal System

---

CS50x

Week 1

Week 2

Week 3

Week 4

Week 5

Week 6

Week 7

Week 8

Week 9

Week 10

Final Project

---

Reward Per Week

300 XP

---

Final Boss

Complete CS50x

Reward

5000 XP

---

Title

```text
HARVARD APPRENTICE
```

---

# 9. CS50P Tree

Weekly System

---

Week 1

Week 2

Week 3

Week 4

Week 5

Week 6

Week 7

Week 8

Week 9

Week 10

Final Project

---

Reward

300 XP per Week

---

Final Boss

5000 XP

---

Title

```text
PYTHON APPRENTICE
```

---

# 10. Academic Tree

Current CGPA

8.81

---

Milestones

9.0

Reward

2000 XP

---

9.2

Reward

4000 XP

---

9.5

Reward

7000 XP

---

Title

```text
SCHOLAR
```

---

# 11. Weight Gain Tree

Current

56kg

---

Goal

65kg

---

Milestones

57kg

58kg

59kg

60kg

61kg

62kg

63kg

64kg

65kg

---

Reward

500 XP per KG

---

Final Boss

65kg

Reward

5000 XP

---

Title

```text
IRON BODY
```

---

# 12. Finance Tree

Goal

Financial Awareness

---

Level 1

30 Days Tracking

---

Level 2

₹5000 Saved

---

Level 3

₹10000 Saved

---

Level 4

90 Days Tracking

---

Boss

180 Days Tracking

Reward

3000 XP

---

Title

```text
WEALTH KEEPER
```

---

# 13. Consistency Tree

Tracks streaks.

---

7 Days

Reward

100 XP

---

14 Days

Reward

250 XP

---

30 Days

Reward

500 XP

---

60 Days

Reward

1000 XP

---

100 Days

Reward

2500 XP

---

365 Days

Reward

10000 XP

---

Title

```text
DISCIPLINE MONARCH
```

---

# 14. Endgame

When all major trees are complete:

Requirements

✓ DSA Tree Complete

✓ 300 LeetCode Problems

✓ 100 Codeforces Problems

✓ Full Stack Project

✓ CS50x Complete

✓ CS50P Complete

✓ CGPA Above 9.2

✓ Weight 65kg

✓ 365 Day Streak

---

Unlock Final Achievement

```text
SHADOW MONARCH
```

Description:

You became the person you wanted to be.

---

END OF PART 14

# Leveling Up

# Part 15 – Mobile App Architecture & Android Design Specification

Version 1.0

Platform:
Android First

Future:
Linux Desktop
Web
PWA

---

# 1. Mobile Philosophy

The mobile app is NOT a compressed version of the desktop app.

The mobile app is the primary interface.

Most user interactions will happen on mobile.

Examples:

✓ Checking quests

✓ Logging food

✓ Logging expenses

✓ Writing notes

✓ Viewing progress

✓ Reviewing backlogs

---

Desktop is primarily for:

* Deep review
* Analytics
* Planning

---

# 2. Mobile Design Principles

Rule 1

Everything should be usable with one hand.

---

Rule 2

Most actions should require less than 3 taps.

---

Rule 3

The dashboard should answer:

"What do I need to do today?"

within 5 seconds.

---

Rule 4

Fast entry is more important than perfect entry.

---

Example:

Food logging should take:

5 seconds

not

30 seconds

---

# 3. Mobile Navigation

Bottom Navigation

```text
Dashboard

Progress

Health

Notes

More
```

---

Reason

Thumb Reachability

Most frequently used screens are easily accessible.

---

# 4. Dashboard Screen

Primary screen.

Opens by default.

---

Structure

```text
Leveling Up

[D Rank]

XP Progress

Current Streak

Coins

--------------------------------

TODAY

□ Striver

□ Web Dev

□ Codeforces

□ Calories

□ Protein

□ Notes

□ Expenses

--------------------------------

BACKLOG

2 LeetCode

1 Codeforces

--------------------------------

WEEKLY PROGRESS

LeetCode

Codeforces

CS50x

CS50P
```

---

# 5. Quick Action FAB

Bottom Right

Contains:

```text
+ Note

+ Expense

+ Food

+ Weight
```

---

Purpose

Instant entry.

---

# 6. Quest Completion UX

User taps quest.

---

Quest expands.

Example

```text
Striver

Progress

1 / 2

[ + ]
```

---

Press +

Updates progress.

---

When complete:

```text
Quest Completed

+50 XP

+10 Coins
```

---

# 7. Mobile Calendar

Monthly View

Exactly inspired by reference screenshots.

---

Each day displays:

```text
Completion %

XP Earned

Status Color
```

---

Tap Day

↓

Open Day Details Sheet

---

# 8. Day Details Sheet

Displays:

Tasks

XP

Coins

Notes

Food

Expenses

---

Bottom Sheet

instead of full page.

---

# 9. Progress Screen

Tabs

```text
DSA

Development

Academics

Health

Finance
```

---

Each tab contains:

Progress Nodes

Bosses

Completion %

---

# 10. DSA Screen

Example

```text
Arrays

17 / 36

██████░░░░

47%
```

---

Tap

↓

Open Topic Details

---

# 11. Boss Screen

Displays:

Active Bosses

Locked Bosses

Completed Bosses

---

Example

```text
ARRAY MASTER

17 / 36

Reward

1000 XP
```

---

# 12. Health Screen

Structure

```text
Current Weight

56kg

Goal

65kg

----------------

Calories

2200 / 3000

----------------

Protein

95 / 120g
```

---

# 13. Food Entry Experience

Most important mobile flow.

---

User taps:

Add Food

---

Input:

```text
4 eggs
500ml milk
2 bananas
```

---

AI Parser

↓

Calculates

Calories

Protein

---

Preview

↓

Save

---

Maximum Time

10 Seconds

---

# 14. Weight Entry Flow

Tap

Add Weight

---

Input

```text
56.4
```

---

Save

---

Done

---

Maximum Time

5 Seconds

---

# 15. Finance Screen

Shows:

Today

Week

Month

---

Quick Add

```text
₹40

Food

Maggie
```

---

Save

---

Done

---

# 16. Notes Screen

Simple.

---

Top

Search

---

Middle

Notes List

---

Bottom

New Note

---

No folders.

No complexity.

---

# 17. Quick Capture System

Long press app icon.

Options:

```text
Add Note

Add Expense

Add Food

Open Dashboard
```

---

Android Shortcut Support.

---

# 18. Notifications

Minimal.

---

Default

OFF

---

Optional Reminders

Morning

```text
Open Leveling Up
Review Today's Quests
```

---

Evening

```text
Review Progress
```

---

No spam.

---

# 19. Widgets

Android Home Widget

Version 1.1

---

Small Widget

```text
Rank

XP

Streak
```

---

Medium Widget

```text
Today's Quests

Completion %
```

---

Large Widget

```text
Dashboard Summary
```

---

# 20. Offline Mode

Works fully offline.

---

Food Logging

Offline

---

Notes

Offline

---

Expenses

Offline

---

Progress

Offline

---

Everything Offline

---

# 21. Sync Mode

Future

---

Manual Sync

---

Cloud Sync

---

Multiple Devices

---

User Controlled

---

# 22. PWA Strategy

Phase 1

Build as PWA.

---

Benefits

Installable

Android Ready

Offline

Fast

---

No Play Store Needed

---

# 23. Android Packaging

Phase 2

Capacitor

---

Convert PWA

↓

Native Android App

---

Features

Notifications

Widgets

File Backup

Shortcuts

---

# 24. Mobile Performance Targets

Cold Start

< 2 Seconds

---

Dashboard

< 500ms

---

Search

< 200ms

---

Food Entry

< 1 Second

---

# 25. Mobile MVP

Version 1

Must Have

✓ Dashboard

✓ Quests

✓ XP

✓ Coins

✓ Streaks

✓ Backlogs

✓ Notes

✓ Weight

✓ Calories

✓ Expenses

✓ Progress Trees

---

# 26. Future Mobile Features

Version 2

AI Food Parser

AI Reviews

AI Coach

---

Version 3

Widgets

Sync

Android Shortcuts

---

Version 4

Native Android Features

Biometrics

Voice Notes

Voice Food Logging

---

# 27. Final Mobile Principle

When standing in a hostel mess line, walking between classes, or lying on a hostel bed, the user should be able to:

* Log food
* Complete quests
* Add expenses
* Write ideas
* Review progress

in under 30 seconds.

If a feature requires more effort than that, redesign it.

---

END OF PART 15                                                                                                                                                                                                                                                                                                                                                                                                                                Sort by:                                                                                                                Comments Section                                                                                                                                                                                                                                                                                                                                                                                                            ExactJuggernauts                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Well done! I would be interested in knowing how well this scales  with more users as this seems like the biggest issue with vibecode apps.  Will the infrastructure hold, let us know how it works out please :))                                                                                                                                                                               3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ElegantDetective5248                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Curious about the scaling too, props for building an app 🎉                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Heavy_Order_730                               OP                         •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      scale in mobile apps is half-way handled by apple as they  distribute your code to users, the backend side is what i need to worry  about but convex auto-scales (as all managed services), so should be  scalable by default                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ponzi314                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      I assume it's not a native iOS app in AppStore?  I want to get into app dev but Xcode stopping me                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     bibboo                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Xcode isn’t a requirement if you’re using expo. I develop for mobile. Do not have a Mac.                                                                                                                                                                                2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ponzi314                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Let me preface this with I'm new to vibe coding. I've also only  done Linux/ui coding. Mostly in golang so iOS coding is a black box to  me. I've never heard of expo but looking at it. Seems i need to check it  out. This bypasses the need for Xcode/swift but does it let you access  iPhone specific things?                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     bibboo                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Expo is not the language itself. The app is built with React  Native, that has support for most iPhone specific things. There's always  the option to write native code with it as well, but I've not once  needed it.            Expo, is used to make developing with React Native easier. And if  you do not have a Mac computer, you can build 15 times a month for free  through Expos EAS service. Expo Go can be used to test out a lot of  features, but not all, without building. There's also development  builds. So you get decently far on the 15 builds.            If you need more, you can set up a fair bit more with Github  runner minutes. Free if your project is public, or $4/month if its  private. There's always the option to set up a VM to build on as well,  though Apple do not permit it. Haven't heard about anyone getting in  trouble over it though.                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    alinarice                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Love this breakdown, clean process, great tool choices and the app  sounds polished already, definitely worth refining a bit more and  pushing it to the App store.                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Heavy_Order_730                               OP                         •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      thanks for the feedback!                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      Annual-Chart9466                    

# Leveling Up

# Part 15 – Mobile App Architecture & Android Design Specification

Version 1.0

Platform:
Android First

Future:
Linux Desktop
Web
PWA

---

# 1. Mobile Philosophy

The mobile app is NOT a compressed version of the desktop app.

The mobile app is the primary interface.

Most user interactions will happen on mobile.

Examples:

✓ Checking quests

✓ Logging food

✓ Logging expenses

✓ Writing notes

✓ Viewing progress

✓ Reviewing backlogs

---

Desktop is primarily for:

* Deep review
* Analytics
* Planning

---

# 2. Mobile Design Principles

Rule 1

Everything should be usable with one hand.

---

Rule 2

Most actions should require less than 3 taps.

---

Rule 3

The dashboard should answer:

"What do I need to do today?"

within 5 seconds.

---

Rule 4

Fast entry is more important than perfect entry.

---

Example:

Food logging should take:

5 seconds

not

30 seconds

---

# 3. Mobile Navigation

Bottom Navigation

```text
Dashboard

Progress

Health

Notes

More
```

---

Reason

Thumb Reachability

Most frequently used screens are easily accessible.

---

# 4. Dashboard Screen

Primary screen.

Opens by default.

---

Structure

```text
Leveling Up

[D Rank]

XP Progress

Current Streak

Coins

--------------------------------

TODAY

□ Striver

□ Web Dev

□ Codeforces

□ Calories

□ Protein

□ Notes

□ Expenses

--------------------------------

BACKLOG

2 LeetCode

1 Codeforces

--------------------------------

WEEKLY PROGRESS

LeetCode

Codeforces

CS50x

CS50P
```

---

# 5. Quick Action FAB

Bottom Right

Contains:

```text
+ Note

+ Expense

+ Food

+ Weight
```

---

Purpose

Instant entry.

---

# 6. Quest Completion UX

User taps quest.

---

Quest expands.

Example

```text
Striver

Progress

1 / 2

[ + ]
```

---

Press +

Updates progress.

---

When complete:

```text
Quest Completed

+50 XP

+10 Coins
```

---

# 7. Mobile Calendar

Monthly View

Exactly inspired by reference screenshots.

---

Each day displays:

```text
Completion %

XP Earned

Status Color
```

---

Tap Day

↓

Open Day Details Sheet

---

# 8. Day Details Sheet

Displays:

Tasks

XP

Coins

Notes

Food

Expenses

---

Bottom Sheet

instead of full page.

---

# 9. Progress Screen

Tabs

```text
DSA

Development

Academics

Health

Finance
```

---

Each tab contains:

Progress Nodes

Bosses

Completion %

---

# 10. DSA Screen

Example

```text
Arrays

17 / 36

██████░░░░

47%
```

---

Tap

↓

Open Topic Details

---

# 11. Boss Screen

Displays:

Active Bosses

Locked Bosses

Completed Bosses

---

Example

```text
ARRAY MASTER

17 / 36

Reward

1000 XP
```

---

# 12. Health Screen

Structure

```text
Current Weight

56kg

Goal

65kg

----------------

Calories

2200 / 3000

----------------

Protein

95 / 120g
```

---

# 13. Food Entry Experience

Most important mobile flow.

---

User taps:

Add Food

---

Input:

```text
4 eggs
500ml milk
2 bananas
```

---

AI Parser

↓

Calculates

Calories

Protein

---

Preview

↓

Save

---

Maximum Time

10 Seconds

---

# 14. Weight Entry Flow

Tap

Add Weight

---

Input

```text
56.4
```

---

Save

---

Done

---

Maximum Time

5 Seconds

---

# 15. Finance Screen

Shows:

Today

Week

Month

---

Quick Add

```text
₹40

Food

Maggie
```

---

Save

---

Done

---

# 16. Notes Screen

Simple.

---

Top

Search

---

Middle

Notes List

---

Bottom

New Note

---

No folders.

No complexity.

---

# 17. Quick Capture System

Long press app icon.

Options:

```text
Add Note

Add Expense

Add Food

Open Dashboard
```

---

Android Shortcut Support.

---

# 18. Notifications

Minimal.

---

Default

OFF

---

Optional Reminders

Morning

```text
Open Leveling Up
Review Today's Quests
```

---

Evening

```text
Review Progress
```

---

No spam.

---

# 19. Widgets

Android Home Widget

Version 1.1

---

Small Widget

```text
Rank

XP

Streak
```

---

Medium Widget

```text
Today's Quests

Completion %
```

---

Large Widget

```text
Dashboard Summary
```

---

# 20. Offline Mode

Works fully offline.

---

Food Logging

Offline

---

Notes

Offline

---

Expenses

Offline

---

Progress

Offline

---

Everything Offline

---

# 21. Sync Mode

Future

---

Manual Sync

---

Cloud Sync

---

Multiple Devices

---

User Controlled

---

# 22. PWA Strategy

Phase 1

Build as PWA.

---

Benefits

Installable

Android Ready

Offline

Fast

---

No Play Store Needed

---

# 23. Android Packaging

Phase 2

Capacitor

---

Convert PWA

↓

Native Android App

---

Features

Notifications

Widgets

File Backup

Shortcuts

---

# 24. Mobile Performance Targets

Cold Start

< 2 Seconds

---

Dashboard

< 500ms

---

Search

< 200ms

---

Food Entry

< 1 Second

---

# 25. Mobile MVP

Version 1

Must Have

✓ Dashboard

✓ Quests

✓ XP

✓ Coins

✓ Streaks

✓ Backlogs

✓ Notes

✓ Weight

✓ Calories

✓ Expenses

✓ Progress Trees

---

# 26. Future Mobile Features

Version 2

AI Food Parser

AI Reviews

AI Coach

---

Version 3

Widgets

Sync

Android Shortcuts

---

Version 4

Native Android Features

Biometrics

Voice Notes

Voice Food Logging

---

# 27. Final Mobile Principle

When standing in a hostel mess line, walking between classes, or lying on a hostel bed, the user should be able to:

* Log food
* Complete quests
* Add expenses
* Write ideas
* Review progress

in under 30 seconds.

If a feature requires more effort than that, redesign it.

---

END OF PART 15                                                                                                                                                                                                                                                                                                                                                                                                                                Sort by:                                                                                                                Comments Section                                                                                                                                                                                                                                                                                                                                                                                                            ExactJuggernauts                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Well done! I would be interested in knowing how well this scales  with more users as this seems like the biggest issue with vibecode apps.  Will the infrastructure hold, let us know how it works out please :))                                                                                                                                                                               3                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ElegantDetective5248                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Curious about the scaling too, props for building an app 🎉                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Heavy_Order_730                               OP                         •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      scale in mobile apps is half-way handled by apple as they  distribute your code to users, the backend side is what i need to worry  about but convex auto-scales (as all managed services), so should be  scalable by default                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      ponzi314                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      I assume it's not a native iOS app in AppStore?  I want to get into app dev but Xcode stopping me                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     bibboo                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Xcode isn’t a requirement if you’re using expo. I develop for mobile. Do not have a Mac.                                                                                                                                                                                2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       ponzi314                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Let me preface this with I'm new to vibe coding. I've also only  done Linux/ui coding. Mostly in golang so iOS coding is a black box to  me. I've never heard of expo but looking at it. Seems i need to check it  out. This bypasses the need for Xcode/swift but does it let you access  iPhone specific things?                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     bibboo                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Expo is not the language itself. The app is built with React  Native, that has support for most iPhone specific things. There's always  the option to write native code with it as well, but I've not once  needed it.            Expo, is used to make developing with React Native easier. And if  you do not have a Mac computer, you can build 15 times a month for free  through Expos EAS service. Expo Go can be used to test out a lot of  features, but not all, without building. There's also development  builds. So you get decently far on the 15 builds.            If you need more, you can set up a fair bit more with Github  runner minutes. Free if your project is public, or $4/month if its  private. There's always the option to set up a VM to build on as well,  though Apple do not permit it. Haven't heard about anyone getting in  trouble over it though.                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    alinarice                                  •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      Love this breakdown, clean process, great tool choices and the app  sounds polished already, definitely worth refining a bit more and  pushing it to the App store.                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       Heavy_Order_730                               OP                         •               6mo ago                                                                                                                                                                                                                                                                                                                                                                                                                      thanks for the feedback!                                                                                                                                                                               1                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      Annual-Chart9466                    

# Leveling Up

# Part 17 – Complete Design System & UI Implementation Guide

Version 1.0

Design Philosophy:
Minimal
Fast
Dark
Information Dense

Inspired By:

* GitHub
* Linear
* Obsidian
* Raycast
* Your Reference Screenshots

---

# 1. Design Goals

When opening Leveling Up:

The user should immediately see:

1. What needs to be done
2. What was missed
3. What progress was made
4. What is closest to completion

No decorative elements.

No distractions.

No fake gamification.

No visual clutter.

---

# 2. Design Language

Think:

```text
Developer Dashboard
+
Personal Operating System
+
RPG Progression
```

NOT:

```text
Mobile Game
+
Habitica
+
Duolingo
```

---

# 3. Color System

## Background

Primary

```css
#090909
```

---

Secondary

```css
#111111
```

---

Card

```css
#171717
```

---

Border

```css
#262626
```

---

Divider

```css
#333333
```

---

# Text

Primary

```css
#FFFFFF
```

---

Secondary

```css
#A3A3A3
```

---

Muted

```css
#737373
```

---

# Success

```css
#22C55E
```

Used For:

Completed Tasks

100% Progress

Achievements

---

# Warning

```css
#EAB308
```

Used For:

Partial Completion

---

# Danger

```css
#EF4444
```

Used For:

Backlogs

Broken Streaks

Missed Goals

---

# Information

```css
#3B82F6
```

Used For:

Progress

XP

Ranking

---

# 4. Typography

Primary Font

```text
Inter
```

---

Secondary Font

```text
JetBrains Mono
```

---

Usage

Inter

* UI
* Cards
* Labels

JetBrains Mono

* XP
* Stats
* Numbers
* Progress

---

# Font Scale

```text
Display     32px

H1          24px

H2          20px

H3          18px

Body        16px

Small       14px

Tiny        12px
```

---

# 5. Spacing System

Only use:

```text
4

8

12

16

20

24

32

48
```

---

Examples

Card Padding

```text
16px
```

---

Section Gap

```text
24px
```

---

Page Padding

```text
20px
```

---

# 6. Border Radius

Cards

```text
16px
```

---

Buttons

```text
12px
```

---

Inputs

```text
12px
```

---

Modals

```text
20px
```

---

# 7. Shadows

Rule:

No shadows.

---

Use:

Borders

Contrast

Spacing

---

Instead.

---

# 8. Animation Rules

Animations must be subtle.

Maximum Duration

```text
200ms
```

---

Allowed

Fade

Slide

Expand

---

Not Allowed

Bounce

Pulse

Spin

Confetti

---

# 9. Dashboard Components

## Rank Card

```text
D Rank

1840 / 3000 XP

61%
```

---

Height

```text
120px
```

---

# XP Card

```text
XP

1840

██████░░░░
```

---

# Coin Card

```text
Coins

420
```

---

# Streak Card

```text
17 Days

Current Streak
```

---

# 10. Quest Card

Structure

```text
☐ Striver

Progress
1 / 2

Reward
50 XP
10 Coins
```

---

Completed State

```text
☑ Striver

Completed
```

---

# 11. Focus Card

NEW COMPONENT

Highest Priority.

---

Purpose

Reduce overwhelm.

---

Example

```text
TODAY'S MAIN QUEST

1. Striver

2 Questions

2. Web Development

1 Topic

3. Codeforces

1 Problem
```

---

Only 3 items.

---

Everything else becomes secondary.

---

# 12. Backlog Card

Most important card after Focus Card.

---

Example

```text
BACKLOG

LeetCode

2 Questions

Codeforces

1 Problem
```

---

If backlog > 10

Card becomes red.

---

If backlog > 25

Display warning.

---

# 13. Progress Bar

Height

```text
8px
```

---

Radius

```text
999px
```

---

Example

```text
████████░░
```

---

Always show percentage.

---

# 14. Progress Tree Component

```text
Arrays

17 / 36

47%

█████░░░░░
```

---

Tap

↓

Open Details

---

# 15. Boss Card

```text
ARRAY MASTER

17 / 36

Reward

1000 XP
100 Coins
```

---

Completed

```text
DEFEATED
```

Badge appears.

---

# 16. Statistics Cards

Example

```text
Total XP

8420
```

---

```text
Longest Streak

29 Days
```

---

```text
Problems Solved

147
```

---

Uniform Layout

Always.

---

# 17. Health Cards

Weight

```text
56kg

Goal

65kg
```

---

Calories

```text
2200 / 3000
```

---

Protein

```text
95 / 120g
```

---

# 18. Food Input

Style

```text
Multiline Textarea
```

---

Example

```text
4 eggs
500ml milk
2 bananas
```

---

No complicated forms.

---

# 19. Notes UI

Minimal.

---

No folders.

No workspaces.

No complexity.

---

Structure

```text
Search

↓

List

↓

Editor
```

---

# 20. Navigation Design

Bottom Navigation

Icons + Labels

```text
Dashboard

Progress

Health

Notes

More
```

---

Active Item

Green indicator.

---

# 21. Empty States

Notes

```text
No notes yet.

Capture your first idea.
```

---

Expenses

```text
No expenses recorded.
```

---

Health

```text
Add your first weight entry.
```

---

# 22. Achievement Design

Unlocked

```text
🏆

First Contest
```

---

Locked

```text
?
```

---

Simple.

No flashy effects.

---

# 23. Notification Design

Only 2 notifications allowed.

---

Morning

```text
Review today's quests.
```

---

Evening

```text
Review today's progress.
```

---

No motivational quotes.

---

# 24. Tailwind Theme Tokens

```typescript
colors: {

  background: "#090909",

  surface: "#171717",

  border: "#262626",

  text: "#FFFFFF",

  muted: "#A3A3A3",

  success: "#22C55E",

  warning: "#EAB308",

  danger: "#EF4444",

  info: "#3B82F6"
}
```

---

# 25. shadcn Components Mapping

Use:

```text
Card

Button

Input

Textarea

Sheet

Dialog

Tabs

Badge

Progress

ScrollArea

Tooltip
```

---

Avoid:

```text
Carousel

Drawer-heavy UI

Complex Menus

Fancy Charts
```

---

# 26. Mobile Layout Hierarchy

Dashboard

```text
Focus Card

↓

Stats

↓

Today's Quests

↓

Backlogs

↓

Weekly Progress

↓

Calendar
```

This order is mandatory.

---

# 27. Design Rule For Deepak

If a feature increases complexity but does not increase consistency:

Reject it.

Examples:

❌ Social Feed

❌ Friends

❌ Public Leaderboards

❌ Chat

❌ Community

❌ Sharing

Examples:

✅ Faster Logging

✅ Better Progress Tracking

✅ Better Analytics

✅ Better Backlog Visibility

---

# 28. Final UI Principle

The UI should feel like:

```text
A command center for your life.
```

Not:

```text
A productivity toy.
```

When you open Leveling Up at 11 PM after college, coding, assignments, and hostel life, it should immediately tell you:

```text
What is left?

What was missed?

What matters most tomorrow?
```

Nothing more.

Nothing less.

---

END OF PART 17

DESIGN SYSTEM COMPLETE
