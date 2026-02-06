import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  Users,
  Trophy,
  Activity,
  Settings,
  UserPlus,
  Filter,
  Dumbbell,
  Search,
  PieChart,
  Trash2,
  Download,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckSquare,
  ListOrdered,
  Sparkles,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Sliders,
  X,
  Info,
  ChevronDown,
  ChevronUp,
  Diamond,
  Globe,
  Footprints,
  Crown,
  TrendingDown,
  Pencil,
  History,
  Eye,
  LayoutDashboard,
  Play,
  FastForward,
  Pause,
  Save,
  UserMinus,
  Star,
  Users2,
  ChevronRight,
  UserCheck,
  Table2,
  Kanban,
  HelpCircle,
  FileText,
} from "lucide-react";

/**
 * ============================================================================
 * SECTION 1: CONFIGURATION & CONSTANTS (設定與常數層)
 * ============================================================================
 */

// 1.1 運動項目元數據配置
const SPORTS_META = {
  softball: {
    id: "softball",
    label: "壘球",
    icon: Diamond,
    color: "orange",
    hasPos: true,
    hasDefense: true,
    posLabel: "位置",
    defLabel: "守備",
    posOptions: ["", "投手", "內野手", "外野手"],
    defOptions: ["", "P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF", "SF"],
    posField: "softball",
    subColumns: [
      {
        key: "pitcher",
        label: "投手",
        width: "w-10",
        filter: (m) =>
          safeIncludes(m.pos.softball, "投手") ||
          safeIncludes(m.pos.softball, "p"),
      },
      {
        key: "infield",
        label: "內野",
        width: "w-10",
        filter: (m) =>
          safeIncludes(m.pos.softball, "內野") ||
          safeIncludes(m.pos.softball, "一壘") ||
          safeIncludes(m.pos.softball, "二壘") ||
          safeIncludes(m.pos.softball, "三壘") ||
          safeIncludes(m.pos.softball, "游擊"),
      },
      {
        key: "outfield",
        label: "外野",
        width: "w-10",
        filter: (m) => safeIncludes(m.pos.softball, "外野"),
      },
    ],
  },
  basketball: {
    id: "basketball",
    label: "籃球",
    icon: Globe,
    color: "amber",
    hasPos: true,
    posLabel: "位置",
    posOptions: ["", "中鋒", "大前鋒", "小前鋒", "得分後衛", "控球後衛"],
    posField: "basketball",
    subColumns: [
      {
        key: "c",
        label: "5/C",
        width: "w-8",
        filter: (m) =>
          safeIncludes(m.pos.basketball, "中鋒") ||
          safeIncludes(m.pos.basketball, "5"),
      },
      {
        key: "pf",
        label: "4/PF",
        width: "w-8",
        filter: (m) =>
          safeIncludes(m.pos.basketball, "大前鋒") ||
          safeIncludes(m.pos.basketball, "4"),
      },
      {
        key: "sf",
        label: "3/SF",
        width: "w-8",
        filter: (m) =>
          safeIncludes(m.pos.basketball, "小前鋒") ||
          safeIncludes(m.pos.basketball, "3"),
      },
      {
        key: "sg",
        label: "2/SG",
        width: "w-8",
        filter: (m) =>
          safeIncludes(m.pos.basketball, "得分") ||
          safeIncludes(m.pos.basketball, "2"),
      },
      {
        key: "pg",
        label: "1/PG",
        width: "w-8",
        filter: (m) =>
          safeIncludes(m.pos.basketball, "控球") ||
          safeIncludes(m.pos.basketball, "1"),
      },
    ],
  },
  badminton: {
    id: "badminton",
    label: "羽球",
    icon: (props) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M12 18a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
        <path d="M15 18L19 3" />
        <path d="M9 18L5 3" />
        <path d="M12 18V3" />
        <path d="M6 8h12" />
        <path d="M5 3h14" />
      </svg>
    ),
    color: "green",
    hasPos: false,
    splitGender: true,
    subColumns: [
      {
        key: "male",
        label: "男",
        width: "w-8",
        className: "text-green-600",
        filter: (m) => !isFemale(m.gender) && m.scores.badminton > 0,
      },
      {
        key: "female",
        label: "女",
        width: "w-8",
        className: "text-green-600",
        filter: (m) => isFemale(m.gender) && m.scores.badminton > 0,
      },
    ],
  },
  swimming: {
    id: "swimming",
    label: "游泳",
    icon: (props) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M2 19c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 5 2 2.5-2 5-2" />
        <circle cx="16" cy="13" r="2.5" />
        <path d="M13.5 15H8" />
        <path d="M14 13L10 8L5 11" />
      </svg>
    ),
    color: "cyan",
    hasPos: true,
    posLabel: "游式",
    posField: "swim",
    posOptions: ["", "蛙式", "自由式", "自由式/蛙式"],
    subColumns: [
      {
        key: "breast",
        label: "蛙式",
        width: "w-10",
        filter: (m) => safeIncludes(m.pos.swim, "蛙"),
      },
      {
        key: "free",
        label: "自由式",
        width: "w-10",
        filter: (m) => safeIncludes(m.pos.swim, "自由"),
      },
    ],
  },
  running: {
    id: "running",
    label: "跑步",
    icon: Footprints,
    color: "purple",
    hasPos: false,
    subColumns: [],
  },
};

// 1.2 隊伍配置
const TEAMS_CONFIG = [
  {
    id: "red",
    name: "紅隊 (Red)",
    color: "red",
    bg: "bg-red-50",
    text: "text-red-700",
  },
  {
    id: "yellow",
    name: "黃隊 (Yellow)",
    color: "yellow",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
  },
  {
    id: "blue",
    name: "藍隊 (Blue)",
    color: "blue",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    id: "purple",
    name: "紫隊 (Purple)",
    color: "purple",
    bg: "bg-purple-50",
    text: "text-purple-700",
  },
  {
    id: "black",
    name: "黑隊 (Black)",
    color: "slate",
    bg: "bg-slate-100",
    text: "text-slate-800",
  },
  {
    id: "orange",
    name: "橘隊 (Orange)",
    color: "orange",
    bg: "bg-orange-50",
    text: "text-orange-700",
  },
];

// 1.3 分數等級與規則預設值
const SCORE_LEVELS = [3, 2.5, 2, 1.5, 1, 0.5, 0];

const DEFAULT_PRIORITY_CONFIG = {
  sportOrder: ["basketball", "softball", "badminton", "swimming", "running"],
  basketballPosOrder: [
    { label: "中鋒 (5號)", keywords: ["中鋒", "5", "center"] },
    { label: "大前鋒 (4號)", keywords: ["大前鋒", "4", "pf"] },
    { label: "小前鋒 (3號)", keywords: ["小前鋒", "3", "sf", "前鋒"] },
    { label: "得分後衛 (2號)", keywords: ["得分", "2", "sg", "後衛"] },
    { label: "控球後衛 (1號)", keywords: ["控球", "1", "pg"] },
  ],
  softballPosOrder: [
    { label: "投手", keywords: ["投手", "p"] },
    {
      label: "內野手",
      keywords: [
        "內野",
        "一壘",
        "二壘",
        "三壘",
        "if",
        "1b",
        "2b",
        "3b",
        "游擊",
        "ss",
      ],
    },
    { label: "外野手", keywords: ["外野", "of", "lf", "cf", "rf"] },
  ],
};

const DEFAULT_RULES = {
  enablePriority: true,
  enableThresholds: true,
  thresholds: {
    basketball: 1.5,
    softball: 1.5,
    badminton: 1.5,
    swimming: 1.5,
    running: 1.5,
  },
};

// 1.4 初始資料 (Mock Data)
const INITIAL_DATA = [
  {
    uid: "mock-1",
    id: "19880001",
    company: "四零四",
    name: "JE Hsu (徐正義)",
    dept: "四零四集團董事會",
    deptCode: "BOD",
    type: "正式",
    relation: "同仁",
    identity: "本人",
    gender: "男",
    linkId: "19880001",
    team: "黃隊 (Yellow)",
    height: "",
    lBand: "Non-L",
    scores: {
      softball: 0,
      basketball: 0,
      badminton: 0,
      swimming: 0,
      running: 0,
    },
    pos: { softball: "", softballDefense: "", basketball: "", swim: "" },
  },
  {
    uid: "mock-2",
    id: "19910001",
    company: "四零發",
    name: "Michael Lin (林信琪)",
    dept: "四零四集團董事會",
    deptCode: "BOD",
    type: "正式",
    relation: "同仁",
    identity: "本人",
    gender: "男",
    linkId: "19910001",
    team: "藍隊 (Blue)",
    height: "",
    lBand: "Non-L",
    scores: {
      softball: 2,
      basketball: 1.5,
      badminton: 2,
      swimming: 0.5,
      running: 0.5,
    },
    pos: {
      softball: "內野手",
      softballDefense: "2B",
      basketball: "",
      swim: "自由式/蛙式",
    },
  },
];

/**
 * ============================================================================
 * SECTION 2: UTILITIES (工具函式層)
 * ============================================================================
 */

function safeIncludes(val, keyword) {
  return String(val || "")
    .toLowerCase()
    .includes(keyword);
}

function isFemale(gender) {
  const g = String(gender).trim().toLowerCase();
  return ["f", "female", "女", "女生"].includes(g);
}

function generateUUID() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 統一顯示位置名稱的函式
function formatPos(sportKey, val) {
  if (!val) return "";
  if (sportKey === "basketball") {
    const s = String(val).trim().toLowerCase();
    if (s.match(/^(5|c|center|中鋒)/)) return "中鋒";
    if (s.match(/^(4|pf|大前)/)) return "大前鋒";
    if (s.match(/^(3|sf|小前)/)) return "小前鋒";
    if (s.match(/^(2|sg|得分)/)) return "得分後衛";
    if (s.match(/^(1|pg|控球)/)) return "控球後衛";
  }
  return val;
}

function normalizeTeamName(rawTeam) {
  if (!rawTeam) return "";
  const str = String(rawTeam).trim();
  const map = {
    紅: "紅隊 (Red)",
    red: "紅隊 (Red)",
    黃: "黃隊 (Yellow)",
    yellow: "黃隊 (Yellow)",
    藍: "藍隊 (Blue)",
    blue: "藍隊 (Blue)",
    紫: "紫隊 (Purple)",
    purple: "紫隊 (Purple)",
    黑: "黑隊 (Black)",
    black: "黑隊 (Black)",
    綠: "黑隊 (Black)",
    green: "黑隊 (Black)",
    橘: "橘隊 (Orange)",
    orange: "橘隊 (Orange)",
  };
  for (let key in map) {
    if (str.toLowerCase().includes(key)) return map[key];
  }
  const found = TEAMS_CONFIG.find(
    (t) =>
      str.includes(t.name.split(" ")[0]) || str.toLowerCase().includes(t.id)
  );
  return found ? found.name : "";
}

function getRowValue(row, possibleKeys, defaultValue = "") {
  for (const key of possibleKeys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return defaultValue;
}

function calculateTotal(scores, rules) {
  if (!scores) return 0;
  return Object.keys(scores).reduce((sum, key) => {
    let score = parseFloat(scores[key] || 0);
    const threshold = rules.enableThresholds ? rules.thresholds[key] || 0 : 0;
    if (score < threshold) score = 0;
    return sum + score;
  }, 0);
}

/**
 * ============================================================================
 * SECTION 3: CUSTOM HOOKS (邏輯掛鉤層)
 * ============================================================================
 */

// 3.1 選秀邏輯 Core Logic
const useTeamDistributor = (employees, rules, priorityConfig, setEmployees) => {
  const [draftState, setDraftState] = useState({
    isActive: false,
    isAutoRunning: false,
    queue: [],
    assigned: [],
    currentTeamIdx: 0,
    direction: 1,
    originalEmployees: [],
    customPickIndex: 0,
  });

  const timerRef = useRef(null);

  const prepareDraft = useCallback(() => {
    const threshold = rules.enableThresholds ? rules.thresholds : null;
    const employeeNameMap = {};
    employees.forEach((e) => {
      if (e.identity === "本人") employeeNameMap[e.id] = e.name;
    });

    // 1. 將所有員工按 "linkId" (家庭) 分組
    const familyGroups = {};
    employees.forEach((emp) => {
      const key = emp.linkId || emp.id;
      if (!familyGroups[key]) {
        familyGroups[key] = {
          id: key,
          members: [],
          maxScore: 0,
          mainName: employeeNameMap[key] || "未知",
          sportValues: Object.keys(SPORTS_META).reduce(
            (acc, k) => ({
              ...acc,
              [k]: { score: 0, posIdx: 999, isFemale: false },
            }),
            {}
          ),
        };
      }
      familyGroups[key].members.push({ ...emp, team: "" });

      // 2. 計算該組在各項運動的最高分與位置權重
      Object.keys(SPORTS_META).forEach((sportKey) => {
        let sVal = emp.scores[sportKey] || 0;
        if (threshold && sVal < threshold[sportKey]) sVal = 0;

        if (sVal > familyGroups[key].sportValues[sportKey].score) {
          familyGroups[key].sportValues[sportKey].score = sVal;
          if (isFemale(emp.gender))
            familyGroups[key].sportValues[sportKey].isFemale = true;

          let idx = -1;
          if (sportKey === "basketball") {
            idx = priorityConfig.basketballPosOrder.findIndex((o) =>
              o.keywords.some((k) => safeIncludes(emp.pos.basketball, k))
            );
          } else if (sportKey === "softball") {
            idx = priorityConfig.softballPosOrder.findIndex((o) =>
              o.keywords.some((k) => safeIncludes(emp.pos.softball, k))
            );
          }
          familyGroups[key].sportValues[sportKey].posIdx =
            idx === -1 ? 999 : idx;
        }
      });
    });

    // 3. 建立排序佇列
    const groups = Object.values(familyGroups);
    const sortedDraftQueue = [];

    // 依分數高低與運動優先序排序
    SCORE_LEVELS.filter((s) => s > 0).forEach((currentScore) => {
      priorityConfig.sportOrder.forEach((sportKey) => {
        const matchGroups = groups.filter(
          (g) =>
            !sortedDraftQueue.includes(g) &&
            g.sportValues[sportKey].score === currentScore
        );
        matchGroups.sort((a, b) => {
          if (sportKey === "badminton") {
            const genderA = a.sportValues[sportKey].isFemale ? 1 : 0;
            const genderB = b.sportValues[sportKey].isFemale ? 1 : 0;
            return genderB - genderA;
          }
          return (
            a.sportValues[sportKey].posIdx - b.sportValues[sportKey].posIdx
          );
        });
        sortedDraftQueue.push(...matchGroups);
      });
    });

    // 處理無戰力人員 (Random Shuffle)
    const zeroGroups = groups.filter((g) => !sortedDraftQueue.includes(g));
    for (let i = zeroGroups.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [zeroGroups[i], zeroGroups[j]] = [zeroGroups[j], zeroGroups[i]];
    }
    sortedDraftQueue.push(...zeroGroups);

    setDraftState({
      isActive: true,
      isAutoRunning: false,
      queue: sortedDraftQueue,
      assigned: [],
      currentTeamIdx: 0,
      direction: 1,
      originalEmployees: JSON.parse(JSON.stringify(employees)),
      customPickIndex: 0,
    });
  }, [employees, rules, priorityConfig]);

  const setCustomPick = useCallback((index) => {
    setDraftState((prev) => ({ ...prev, customPickIndex: index }));
  }, []);

  const nextStep = useCallback(() => {
    setDraftState((prev) => {
      if (prev.queue.length === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        return { ...prev, isAutoRunning: false };
      }

      const pickIndex =
        prev.customPickIndex >= 0 && prev.customPickIndex < prev.queue.length
          ? prev.customPickIndex
          : 0;
      const group = prev.queue[pickIndex];
      const targetTeam = TEAMS_CONFIG[prev.currentTeamIdx];

      const updatedMembers = group.members.map((m) => ({
        ...m,
        team: targetTeam.name,
      }));

      let nextIdx = prev.currentTeamIdx;
      let nextDir = prev.direction;

      // S 型 (Snake) 分配邏輯
      if (prev.direction === 1) {
        if (prev.currentTeamIdx === 5) {
          nextDir = -1;
        } else {
          nextIdx++;
        }
      } else {
        if (prev.currentTeamIdx === 0) {
          nextDir = 1;
        } else {
          nextIdx--;
        }
      }

      const newQueue = [...prev.queue];
      newQueue.splice(pickIndex, 1);

      return {
        ...prev,
        queue: newQueue,
        assigned: [...prev.assigned, ...updatedMembers],
        currentTeamIdx: nextIdx,
        direction: nextDir,
        customPickIndex: 0,
      };
    });
  }, []);

  const toggleAuto = useCallback(() => {
    setDraftState((prev) => {
      const willRun = !prev.isAutoRunning;
      if (willRun) {
        timerRef.current = setInterval(() => {
          setDraftState((curr) => {
            if (curr.queue.length === 0 || !curr.isAutoRunning) {
              clearInterval(timerRef.current);
              return { ...curr, isAutoRunning: false };
            }
            // Auto 模式一律選第一個
            const pickIndex = 0;
            const group = curr.queue[pickIndex];
            const targetTeam = TEAMS_CONFIG[curr.currentTeamIdx];
            const updatedMembers = group.members.map((m) => ({
              ...m,
              team: targetTeam.name,
            }));

            let nextIdx = curr.currentTeamIdx;
            let nextDir = curr.direction;

            if (curr.direction === 1) {
              if (curr.currentTeamIdx === 5) nextDir = -1;
              else nextIdx++;
            } else {
              if (curr.currentTeamIdx === 0) nextDir = 1;
              else nextIdx--;
            }

            const newQueue = [...curr.queue];
            newQueue.splice(pickIndex, 1);

            return {
              ...curr,
              queue: newQueue,
              assigned: [...curr.assigned, ...updatedMembers],
              currentTeamIdx: nextIdx,
              direction: nextDir,
              customPickIndex: 0,
            };
          });
        }, 50);
      } else {
        clearInterval(timerRef.current);
      }
      return { ...prev, isAutoRunning: willRun };
    });
  }, []);

  const manualMove = useCallback((uid, newTeamName) => {
    setDraftState((prev) => {
      const targetMember = prev.assigned.find((m) => m.uid === uid);
      if (!targetMember) return prev;
      const linkId = targetMember.linkId;
      // 連動整個家庭一起移動
      return {
        ...prev,
        assigned: prev.assigned.map((m) =>
          m.linkId === linkId && linkId ? { ...m, team: newTeamName } : m
        ),
      };
    });
  }, []);

  const saveAndExit = useCallback(() => {
    setEmployees((prev) => {
      const assignedMap = new Map(draftState.assigned.map((m) => [m.uid, m]));
      return prev.map((e) =>
        assignedMap.has(e.uid) ? assignedMap.get(e.uid) : e
      );
    });
    setDraftState((prev) => ({ ...prev, isActive: false }));
    if (timerRef.current) clearInterval(timerRef.current);
  }, [draftState.assigned, setEmployees]);

  const cancelDraft = useCallback(() => {
    setDraftState((prev) => ({ ...prev, isActive: false }));
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  return {
    draftState,
    prepareDraft,
    nextStep,
    toggleAuto,
    manualMove,
    saveAndExit,
    cancelDraft,
    setCustomPick,
  };
};

// 3.2 檔案處理 Handler
const useFileHandler = (employees, rules, setEmployees) => {
  const fileInputRef = useRef(null);

  // 動態加載 SheetJS
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
    document.head.appendChild(script);
  }, []);

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = window.XLSX.read(evt.target.result, { type: "binary" });
        const data = window.XLSX.utils.sheet_to_json(
          wb.Sheets[wb.SheetNames[0]]
        );
        const formatted = data.map((row) => {
          const id = String(
            getRowValue(row, ["工號", "id"]) ||
              Math.random().toString(36).substr(2)
          );
          const rawTeam = getRowValue(row, [
            "隊伍",
            "Team",
            "組別",
            "team",
            "隊伍歸屬",
          ]);
          const scores = {};
          const pos = {};

          Object.keys(SPORTS_META).forEach((k) => {
            const label = SPORTS_META[k].label;
            const posLabel = SPORTS_META[k].posLabel;
            scores[k] = Number(
              getRowValue(row, [label, `${label}分數`, k]) || 0
            );

            const pf = SPORTS_META[k].posField || k;
            const possiblePosKeys = [
              `${label}${posLabel || "位置"}`,
              `${label}位置`,
              `${label}position`,
              `${k}Pos`,
            ];
            if (posLabel) possiblePosKeys.push(posLabel);

            pos[pf] = String(getRowValue(row, possiblePosKeys) || "");

            if (SPORTS_META[k].hasDefense) {
              pos[`${k}Defense`] = String(
                getRowValue(row, [
                  `${label}守備`,
                  `${label}defense`,
                  `${label}守備位置`,
                ]) || ""
              );
            }
          });

          return {
            uid: generateUUID(),
            id,
            name: getRowValue(row, ["姓名", "name", "中英文姓名"]) || "未命名",
            dept: getRowValue(row, ["部門", "dept", "部門別"]) || "",
            deptCode:
              getRowValue(row, ["部門縮寫", "deptCode", "部門別縮寫"]) || "",
            gender: getRowValue(row, ["性別", "gender"]) || "",
            company: getRowValue(row, ["公司", "company", "公司別"]) || "",
            type: getRowValue(row, ["類型", "type", "正式/臨時"]) || "正式",
            relation: getRowValue(row, ["關係", "relation", "關系"]) || "同仁",
            identity: getRowValue(row, ["身份", "identity", "身分"]) || "本人",
            team: normalizeTeamName(rawTeam),
            linkId: id,
            height: getRowValue(row, ["身高", "height"]) || "",
            lBand: getRowValue(row, ["L Band", "lBand"]) || "",
            scores,
            pos,
          };
        });
        if (formatted.length) setEmployees(formatted);
      } catch (err) {
        console.error(err);
        alert("匯入失敗");
      }
      e.target.value = null;
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    if (!window.XLSX) return;
    const flat = employees.map((e) => {
      return {
        公司別: e.company,
        工號: e.id,
        姓名: e.name,
        部門別: e.dept,
        部門別縮寫: e.deptCode,
        "正式/臨時": e.type,
        關系: e.relation,
        身份: e.identity,
        性別: e.gender,
        隊伍: e.team,
        壘球: e.scores.softball,
        壘球位置: e.pos.softball,
        壘球守備: e.pos.softballDefense,
        籃球: e.scores.basketball,
        身高: e.height,
        籃球位置: e.pos.basketball,
        羽球: e.scores.badminton,
        游泳: e.scores.swimming,
        游式: e.pos.swim,
        跑步: e.scores.running,
        總分: calculateTotal(e.scores, rules),
        "L Band": e.lBand,
      };
    });
    const ws = window.XLSX.utils.json_to_sheet(flat);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "名單");
    window.XLSX.writeFile(wb, "MOXA_Sports_Export.xlsx");
  };

  return { fileInputRef, handleImport, handleExport };
};

/**
 * ============================================================================
 * SECTION 4: PRESENTATIONAL COMPONENTS (UI 展示層)
 * ============================================================================
 */

// --- Atoms ---

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 flex items-start space-x-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-md ${color} bg-opacity-10 text-opacity-100`}>
      <Icon className={`w-6 h-6 ${color.replace("bg-", "text-")}`} />
    </div>
    <div>
      <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide">
        {title}
      </h3>
      <div className="text-2xl font-bold text-slate-800 mt-1">{value}</div>
      {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
    </div>
  </div>
);

const ClickableCell = ({
  count,
  list,
  title,
  teamName,
  bgClass = "",
  onCellClick,
}) => (
  <td
    className={`p-2 border-r cursor-pointer transition-colors relative group text-center ${bgClass}`}
    onClick={() => onCellClick && onCellClick(`${teamName} - ${title}`, list)}
  >
    {count || "-"}
    {count > 0 && (
      <span className="absolute right-1 top-1 w-1.5 h-1.5 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100"></span>
    )}
  </td>
);

// 更新：ScoreCell 現在支援 darkMode 屬性，並在 dark mode 下使用透明度背景
const ScoreCell = ({
  value,
  type,
  onClick,
  textColor = "text-slate-700",
  darkMode = false,
}) => {
  const isMax = type === "max";
  const isMin = type === "min";

  let bgClass = "";
  let textClass = "";

  if (isMax) {
    bgClass = darkMode ? "bg-yellow-500/20" : "bg-yellow-50";
    textClass = darkMode ? "text-yellow-400" : "text-yellow-700";
  } else if (isMin) {
    bgClass = darkMode ? "bg-red-500/20" : "bg-red-50";
    textClass = darkMode ? "text-red-400" : "text-red-600";
  } else {
    textClass = textColor;
  }

  return (
    <td
      className={`p-2 font-bold relative border-r cursor-pointer transition-colors text-center ${bgClass} ${textClass}`}
      onClick={onClick}
    >
      {value.toFixed(1)}
      {isMax && (
        <Crown
          className={`w-3 h-3 absolute top-1 right-1 ${
            darkMode ? "text-yellow-500" : "text-yellow-500"
          }`}
        />
      )}
      {isMin && (
        <TrendingDown
          className={`w-3 h-3 absolute top-1 right-1 ${
            darkMode ? "text-red-500" : "text-red-400"
          }`}
        />
      )}
    </td>
  );
};

// --- Molecules ---

const FilterDropdown = ({ sportKey, filters, onChange, darkMode }) => {
  const meta = SPORTS_META[sportKey];
  return (
    <div
      className={`flex items-center gap-2 text-sm px-2 py-1 rounded border ${
        darkMode
          ? "bg-slate-700 border-slate-600 text-slate-200"
          : `bg-white border-slate-200 text-${meta.color}-700`
      }`}
    >
      <span className="font-bold">{meta.label}:</span>
      <select
        value={filters[sportKey]}
        onChange={(e) => onChange(sportKey, e.target.value)}
        className="bg-transparent border-none outline-none cursor-pointer font-medium"
      >
        <option value="0" className={darkMode ? "bg-slate-800" : ""}>
          全部
        </option>
        {SCORE_LEVELS.filter((s) => s > 0)
          .reverse()
          .map((s) => (
            <option
              key={s}
              value={s}
              className={darkMode ? "bg-slate-800" : ""}
            >
              ≥ {s}
            </option>
          ))}
      </select>
    </div>
  );
};

const ReorderList = ({ title, items, onMoveUp, onMoveDown, renderItem }) => (
  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 h-full flex flex-col">
    <h4 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2">
      <GripVertical className="w-4 h-4" /> {title}
    </h4>
    <ul className="space-y-2 flex-1 overflow-y-auto">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex items-center justify-between bg-white p-2 rounded shadow-sm border border-slate-100"
        >
          <span className="text-sm font-medium text-slate-700">
            <span className="text-slate-400 text-xs mr-2">#{index + 1}</span>
            {renderItem ? renderItem(item) : item}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onMoveUp(index)}
              disabled={index === 0}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"
            >
              <ArrowUp className="w-3 h-3" />
            </button>
            <button
              onClick={() => onMoveDown(index)}
              disabled={index === items.length - 1}
              className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30"
            >
              <ArrowDown className="w-3 h-3" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

// --- Complex Components ---

const SettingsPanel = ({
  priorityConfig,
  setPriorityConfig,
  rules,
  setRules,
}) => {
  const toggleRule = (k) => setRules((p) => ({ ...p, [k]: !p[k] }));
  const updateThres = (k, v) =>
    setRules((p) => ({
      ...p,
      thresholds: { ...p.thresholds, [k]: parseFloat(v) },
    }));
  const moveItem = (listKey, index, direction) => {
    const list = [...priorityConfig[listKey]];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= list.length) return;
    [list[index], list[newIndex]] = [list[newIndex], list[index]];
    setPriorityConfig((prev) => ({ ...prev, [listKey]: list }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-2 bg-slate-100 rounded text-slate-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              各項運動忽略門檻
            </h3>
            <p className="text-sm text-slate-500">
              低於此分數視為無戰力(0分)。
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => toggleRule("enableThresholds")}
            className={`w-5 h-5 rounded border flex items-center justify-center ${
              rules.enableThresholds
                ? "bg-teal-600 border-teal-600 text-white"
                : "bg-white border-slate-300"
            }`}
          >
            {rules.enableThresholds && <CheckSquare className="w-3.5 h-3.5" />}
          </button>
          <span className="font-bold text-slate-700">啟用忽略低分機制</span>
        </div>
        <div
          className={`grid grid-cols-1 md:grid-cols-5 gap-4 transition-opacity ${
            rules.enableThresholds
              ? "opacity-100"
              : "opacity-50 pointer-events-none"
          }`}
        >
          {Object.values(SPORTS_META).map((meta) => (
            <div
              key={meta.id}
              className="bg-slate-50 p-3 rounded border border-slate-200"
            >
              <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">
                {meta.label}
              </label>
              <select
                value={rules.thresholds[meta.id]}
                onChange={(e) => updateThres(meta.id, e.target.value)}
                className="w-full text-sm border-slate-300 rounded px-2 py-1.5 border"
              >
                {[0, 1, 1.5, 2, 2.5, 3].map((v) => (
                  <option key={v} value={v}>
                    {v === 0 ? "不忽略" : `${v} 分以下`}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
          <div className="p-2 bg-slate-100 rounded text-slate-600">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">選秀優先分配</h3>
            <p className="text-sm text-slate-500">系統分配時的優先權重順序。</p>
          </div>
        </div>
        <div className="mb-6 flex items-start gap-3 p-4 rounded-lg border bg-slate-50 border-slate-200">
          <button
            onClick={() => toggleRule("enablePriority")}
            className={`mt-1 w-5 h-5 rounded border flex items-center justify-center ${
              rules.enablePriority
                ? "bg-teal-600 border-teal-600 text-white"
                : "bg-white border-slate-300"
            }`}
          >
            {rules.enablePriority && <CheckSquare className="w-3.5 h-3.5" />}
          </button>
          <div>
            <h4 className="font-bold text-slate-700">啟用優先分配</h4>
            <p className="text-sm mt-1 text-slate-500">
              選人邏輯：分數-&gt;運動順序-&gt;關鍵位置
            </p>
          </div>
        </div>
        {rules.enablePriority && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <ReorderList
              title="1. 運動項目優先序"
              items={priorityConfig.sportOrder}
              onMoveUp={(i) => moveItem("sportOrder", i, -1)}
              onMoveDown={(i) => moveItem("sportOrder", i, 1)}
              renderItem={(item) => SPORTS_META[item].label}
            />
            <ReorderList
              title="2. 籃球位置優先序"
              items={priorityConfig.basketballPosOrder}
              onMoveUp={(i) => moveItem("basketballPosOrder", i, -1)}
              onMoveDown={(i) => moveItem("basketballPosOrder", i, 1)}
              renderItem={(item) => item.label}
            />
            <ReorderList
              title="3. 壘球位置優先序"
              items={priorityConfig.softballPosOrder}
              onMoveUp={(i) => moveItem("softballPosOrder", i, -1)}
              onMoveDown={(i) => moveItem("softballPosOrder", i, 1)}
              renderItem={(item) => item.label}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const DetailModal = ({ title, members, onClose }) => {
  const [expandedUid, setExpandedUid] = useState(null);
  const getRelevantInfo = (m) => {
    const summaries = Object.keys(SPORTS_META)
      .map((key) => {
        const meta = SPORTS_META[key];
        const score = m.scores[key];
        if (title.includes(meta.label) && score > 0) {
          const pos = m.pos[meta.posField || key];
          return `${score}分${pos ? " | " + pos : ""}`;
        }
        return null;
      })
      .filter(Boolean);
    return summaries.length > 0
      ? summaries.join(", ")
      : `總分: ${Object.values(m.scores).reduce((a, b) => a + b, 0)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-fade-in text-left">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-5 h-5 text-teal-600" /> {title} ({members.length}
            人)
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-0 overflow-y-auto flex-1">
          {members.length === 0 ? (
            <div className="p-8 text-center text-slate-500">沒有符合的人員</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 sticky top-0 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">姓名/部門</th>
                  <th className="px-4 py-3">關係/性別</th>
                  <th className="px-4 py-3 text-right">關鍵資訊</th>
                  <th className="px-2 py-3 w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((m) => (
                  <React.Fragment key={m.uid}>
                    <tr
                      className={`hover:bg-slate-50 cursor-pointer ${
                        expandedUid === m.uid ? "bg-slate-50" : ""
                      }`}
                      onClick={() =>
                        setExpandedUid(expandedUid === m.uid ? null : m.uid)
                      }
                    >
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{m.name}</div>
                        <div className="text-xs text-slate-500">{m.dept}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {m.relation} /{" "}
                        <span
                          className={
                            isFemale(m.gender)
                              ? "text-pink-500 font-bold"
                              : "text-blue-500"
                          }
                        >
                          {m.gender}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-teal-700 font-bold">
                        {getRelevantInfo(m)}
                      </td>
                      <td className="px-2 py-3 text-slate-400">
                        {expandedUid === m.uid ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </td>
                    </tr>
                    {expandedUid === m.uid && (
                      <tr className="bg-slate-50">
                        <td colSpan="4" className="px-4 py-3">
                          <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 p-3 border border-slate-200 rounded bg-white shadow-inner">
                            <div>
                              <span className="font-bold text-slate-800">
                                工號:
                              </span>{" "}
                              {m.id}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800">
                                L Band:
                              </span>{" "}
                              {m.lBand}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800">
                                身高:
                              </span>{" "}
                              {m.height}
                            </div>
                            <div>
                              <span className="font-bold text-slate-800">
                                性別:
                              </span>{" "}
                              {m.gender}
                            </div>
                            <div className="col-span-2 mt-2 pt-2 border-t border-slate-100">
                              <span className="font-bold block mb-1 text-slate-800">
                                各項分數明細:
                              </span>
                              <div className="flex gap-4 flex-wrap">
                                {Object.keys(SPORTS_META).map((key) => {
                                  const meta = SPORTS_META[key];
                                  return (
                                    <span
                                      key={key}
                                      className="flex items-center gap-1"
                                    >
                                      <meta.icon
                                        className={`w-3 h-3 text-${meta.color}-500`}
                                      />{" "}
                                      {meta.label}: {m.scores[key]}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-between items-center">
          <span className="text-xs text-slate-400">
            點擊人員列可展開查看完整分數
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 text-sm font-medium"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

const StatsTables = ({
  employees,
  rules,
  filters,
  onFilterChange,
  darkMode = false,
}) => {
  const [modalData, setModalData] = useState(null);
  const handleFilterChange = (key, val) =>
    onFilterChange((p) => ({ ...p, [key]: parseFloat(val) }));

  const tc = {
    bg: darkMode ? "bg-slate-800" : "bg-white",
    textMain: darkMode ? "text-slate-300" : "text-slate-700",
    textHeader: darkMode ? "text-white" : "text-slate-700",
    border: darkMode ? "border-slate-700" : "border-slate-200",
    headerBg: darkMode ? "bg-slate-900" : "bg-slate-50",
    subHeaderBg: darkMode ? "bg-slate-800" : "bg-slate-100",
    hover: darkMode ? "hover:bg-slate-700" : "hover:bg-slate-50",
    cellText: darkMode ? "text-slate-400" : "text-slate-600",
    totalBg: darkMode ? "bg-slate-900" : "bg-slate-200",
    totalText: darkMode ? "text-white" : "text-slate-900",
  };

  const getSportColorClass = (color) =>
    darkMode
      ? `bg-${color}-900/30 text-${color}-200`
      : `bg-${color}-50 text-${color}-800`;

  const stats = useMemo(() => {
    const getMinMax = (data, key) => {
      const vals = data.map((d) => d[key]);
      return { max: Math.max(...vals), min: Math.min(...vals) };
    };

    const rawStats = TEAMS_CONFIG.map((team) => {
      const teamMembers = employees.filter((e) => e.team === team.name);
      const teamStat = {
        ...team,
        count: teamMembers.length,
        total: 0,
        details: {},
      };

      Object.keys(SPORTS_META).forEach((sportKey) => {
        const meta = SPORTS_META[sportKey];
        const threshold = filters[sportKey];
        const filtered = teamMembers.filter(
          (m) => m.scores[sportKey] >= threshold
        );

        const scoreSum = filtered.reduce(
          (acc, m) => acc + m.scores[sportKey],
          0
        );
        teamStat[sportKey] = scoreSum;
        teamStat.total += scoreSum;

        teamStat.details[sportKey] = {};
        meta.subColumns.forEach((col) => {
          teamStat.details[sportKey][col.key] = filtered.filter(col.filter);
        });
      });
      return teamStat;
    });

    const highlights = { total: getMinMax(rawStats, "total") };
    Object.keys(SPORTS_META).forEach(
      (k) => (highlights[k] = getMinMax(rawStats, k))
    );

    return rawStats.map((t) => ({
      ...t,
      highlights: {
        total:
          t.total === highlights.total.max
            ? "max"
            : t.total === highlights.total.min
            ? "min"
            : "",
        ...Object.keys(SPORTS_META).reduce(
          (acc, k) => ({
            ...acc,
            [k]:
              t[k] === highlights[k].max
                ? "max"
                : t[k] === highlights[k].min
                ? "min"
                : "",
          }),
          {}
        ),
      },
    }));
  }, [employees, rules, filters]);

  const distribution = useMemo(() => {
    return TEAMS_CONFIG.map((team) => {
      const members = employees.filter((e) => e.team === team.name);
      const dist = {};
      Object.keys(SPORTS_META).forEach((sportKey) => {
        const meta = SPORTS_META[sportKey];
        if (meta.splitGender) {
          dist[`${sportKey}_M`] = {};
          dist[`${sportKey}_F`] = {};
          SCORE_LEVELS.forEach((s) => {
            if (s <= 0) return;
            dist[`${sportKey}_M`][s] = members.filter(
              (m) => m.scores[sportKey] === s && !isFemale(m.gender)
            );
            dist[`${sportKey}_F`][s] = members.filter(
              (m) => m.scores[sportKey] === s && isFemale(m.gender)
            );
          });
        } else {
          dist[sportKey] = {};
          SCORE_LEVELS.forEach((s) => {
            if (s <= 0) return;
            dist[sportKey][s] = members.filter((m) => m.scores[sportKey] === s);
          });
        }
      });
      return { ...team, dist };
    });
  }, [employees]);

  const teamColWidth = "w-28 min-w-[112px]";
  const distColumns = useMemo(() => {
    const cols = [];
    Object.keys(SPORTS_META).forEach((key) => {
      const meta = SPORTS_META[key];
      if (meta.splitGender) {
        cols.push({
          key: `${key}_M`,
          label: `${meta.label}(男)`,
          color: meta.color,
        });
        cols.push({
          key: `${key}_F`,
          label: `${meta.label}(女)`,
          color: meta.color,
        });
      } else {
        cols.push({ key, label: meta.label, color: meta.color });
      }
    });
    return cols;
  }, []);
  const scoreLevelsToShow = SCORE_LEVELS.filter((s) => s > 0);

  return (
    <div className="space-y-8 animate-fade-in text-center">
      <div
        className={`${tc.bg} rounded-lg shadow-sm border ${tc.border} overflow-x-auto`}
      >
        <div
          className={`p-4 border-b ${tc.border} ${tc.headerBg} flex flex-col md:flex-row justify-between items-center gap-4`}
        >
          <h4 className={`font-bold ${tc.textHeader}`}>各項位置與積分統計</h4>
          <div className="flex flex-wrap gap-2">
            {Object.keys(SPORTS_META).map((key) => (
              <FilterDropdown
                key={key}
                sportKey={key}
                filters={filters}
                onChange={handleFilterChange}
                darkMode={darkMode}
              />
            ))}
          </div>
        </div>
        <table className="w-full text-sm text-center border-collapse table-fixed md:table-auto">
          <thead>
            <tr
              className={`${tc.headerBg} ${tc.textHeader} font-bold border-b ${tc.border}`}
            >
              <th
                className={`p-3 sticky left-0 ${tc.headerBg} z-10 border-r ${tc.border} text-center ${teamColWidth}`}
              ></th>
              {Object.values(SPORTS_META).map((meta) => (
                <th
                  key={meta.id}
                  className={`p-3 border-r ${tc.border} ${getSportColorClass(
                    meta.color
                  )} text-center`}
                  colSpan={1 + meta.subColumns.length}
                >
                  <span className="flex items-center justify-center gap-2">
                    <meta.icon className="w-4 h-4" /> {meta.label}
                  </span>
                </th>
              ))}
              <th
                className={`p-3 ${tc.totalBg} ${tc.totalText} border-l ${tc.border} text-center w-24`}
              >
                總分
              </th>
            </tr>
            <tr
              className={`${tc.subHeaderBg} ${tc.textMain} font-bold border-b ${tc.border} text-center`}
            >
              <th
                className={`p-2 sticky left-0 ${tc.subHeaderBg} border-r ${tc.border} font-bold ${tc.textMain} text-center ${teamColWidth}`}
              >
                隊伍
              </th>
              {Object.values(SPORTS_META).map((meta) => (
                <React.Fragment key={meta.id}>
                  <th
                    className={`p-2 w-16 ${getSportColorClass(
                      meta.color
                    )} border-r ${tc.border} text-center`}
                  >
                    積分
                  </th>
                  {meta.subColumns.map((col) => (
                    <th
                      key={col.key}
                      className={`p-2 ${col.width} ${getSportColorClass(
                        meta.color
                      )} border-r ${tc.border} text-center ${
                        col.className || ""
                      }`}
                    >
                      {col.label}
                    </th>
                  ))}
                </React.Fragment>
              ))}
              <th
                className={`p-2 w-24 ${tc.subHeaderBg} font-bold ${tc.totalText} border-l ${tc.border} text-center`}
              >
                總分
              </th>
            </tr>
          </thead>
          <tbody>
            {stats.map((row) => (
              <tr
                key={row.id}
                className={`${tc.hover} border-b ${tc.border} ${tc.textMain}`}
              >
                <td
                  className={`p-3 font-bold sticky left-0 ${tc.bg} border-r ${tc.border} ${tc.textMain} ${teamColWidth}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full flex-shrink-0 bg-${
                        row.color === "slate" ? "slate-800" : row.color + "-500"
                      }`}
                    ></span>
                    <span className="truncate">{row.name.split(" ")[0]}</span>
                  </div>
                </td>
                {Object.keys(SPORTS_META).map((key) => {
                  const meta = SPORTS_META[key];
                  return (
                    <React.Fragment key={key}>
                      <ScoreCell
                        value={row[key]}
                        type={row.highlights[key]}
                        onClick={() =>
                          setModalData({
                            title: `${row.name} - ${meta.label}人員`,
                            members: employees.filter(
                              (e) => e.team === row.name && e.scores[key] > 0
                            ),
                          })
                        }
                        textColor={tc.textMain}
                        darkMode={darkMode}
                      />
                      {meta.subColumns.map((col) => (
                        <ClickableCell
                          key={col.key}
                          count={row.details[key][col.key].length}
                          list={row.details[key][col.key]}
                          title={`${meta.label} - ${col.label}`}
                          teamName={row.name}
                          bgClass={tc.cellText}
                          onCellClick={(t, m) =>
                            setModalData({ title: t, members: m })
                          }
                        />
                      ))}
                    </React.Fragment>
                  );
                })}
                <td
                  className={`p-3 font-bold border-l ${
                    tc.border
                  } relative text-center w-24 ${
                    row.highlights.total === "max"
                      ? darkMode
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-yellow-100 text-yellow-800"
                      : row.highlights.total === "min"
                      ? darkMode
                        ? "bg-red-500/20 text-red-300"
                        : "bg-red-50 text-red-800"
                      : `${tc.subHeaderBg} ${tc.totalText}`
                  }`}
                >
                  {row.total.toFixed(1)}
                  {row.highlights.total === "max" && (
                    <Crown className="w-4 h-4 absolute top-1 right-1 text-yellow-600" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className={`${tc.bg} rounded-lg shadow-sm border ${tc.border} overflow-x-auto mt-8`}
      >
        <div
          className={`p-4 border-b ${tc.border} ${tc.headerBg} flex justify-between items-center`}
        >
          <h4 className={`font-bold ${tc.textHeader}`}>
            各隊積分分佈表 (人數統計)
          </h4>
        </div>
        <table className="w-full text-sm text-center border-collapse table-fixed md:table-auto">
          <thead>
            <tr
              className={`${tc.headerBg} ${tc.textHeader} font-bold border-b ${tc.border}`}
            >
              <th
                className={`p-3 sticky left-0 ${tc.headerBg} z-10 border-r ${tc.border} text-center ${teamColWidth}`}
              ></th>
              {distColumns.map((col) => (
                <th
                  key={col.key}
                  className={`p-3 border-r ${tc.border} ${getSportColorClass(
                    col.color
                  )} text-center`}
                  colSpan={scoreLevelsToShow.length}
                >
                  <span className="flex items-center justify-center gap-2">
                    {col.label}
                  </span>
                </th>
              ))}
            </tr>
            <tr
              className={`${tc.subHeaderBg} ${tc.textMain} font-bold border-b ${tc.border} text-center`}
            >
              <th
                className={`p-2 sticky left-0 ${tc.subHeaderBg} border-r ${tc.border} font-bold ${tc.textMain} text-center ${teamColWidth}`}
              >
                隊伍
              </th>
              {distColumns.map((col) => (
                <React.Fragment key={col.key}>
                  {scoreLevelsToShow.map((level) => (
                    <th
                      key={`${col.key}-${level}`}
                      className={`p-2 w-10 ${getSportColorClass(
                        col.color
                      )} border-r ${tc.border} text-center text-xs`}
                    >
                      {level}
                    </th>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {distribution.map((row) => (
              <tr
                key={row.id}
                className={`${tc.hover} border-b ${tc.border} ${tc.textMain}`}
              >
                <td
                  className={`p-3 font-bold sticky left-0 ${tc.bg} border-r ${tc.border} ${tc.textMain} ${teamColWidth}`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full flex-shrink-0 bg-${
                        row.color === "slate" ? "slate-800" : row.color + "-500"
                      }`}
                    ></span>
                    <span className="truncate">{row.name.split(" ")[0]}</span>
                  </div>
                </td>
                {distColumns.map((col) => {
                  const distData = row.dist[col.key] || {};
                  return (
                    <React.Fragment key={col.key}>
                      {scoreLevelsToShow.map((level) => {
                        const members = distData[level] || [];
                        return (
                          <ClickableCell
                            key={`${col.key}-${level}`}
                            count={members.length}
                            list={members}
                            title={`${col.label} - ${level}分人員`}
                            teamName={row.name}
                            bgClass={tc.cellText}
                            onCellClick={(t, m) =>
                              setModalData({ title: t, members: m })
                            }
                          />
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalData && (
        <DetailModal
          title={modalData.title}
          members={modalData.members}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
};

const StatisticsTable = ({ employees, rules, filters, onFilterChange }) => {
  return (
    <StatsTables
      employees={employees}
      rules={rules}
      filters={filters}
      onFilterChange={onFilterChange}
      darkMode={false}
    />
  );
};

const EmployeeTable = ({
  data,
  setData,
  onDelete,
  rules,
  onExport,
  onImportRef,
  onImport,
  onEdit,
  onView,
  onClear,
  onAdd,
}) => {
  const [filterText, setFilterText] = useState("");
  const [filterTeam, setFilterTeam] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortValue = (emp, key) => {
    if (key === "total") return calculateTotal(emp.scores, rules);
    if (key.startsWith("scores.")) {
      const sportKey = key.split(".")[1];
      return emp.scores[sportKey] || 0;
    }
    return emp[key] || "";
  };

  const filteredData = useMemo(() => {
    let res = data.filter((emp) => {
      const matchText =
        safeIncludes(emp.name, filterText) || safeIncludes(emp.id, filterText);
      const matchTeam =
        filterTeam === "all"
          ? true
          : filterTeam === "unassigned"
          ? !emp.team
          : emp.team === filterTeam;
      return matchText && matchTeam;
    });

    if (sortConfig.key) {
      res.sort((a, b) => {
        const valA = getSortValue(a, sortConfig.key);
        const valB = getSortValue(b, sortConfig.key);
        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return res;
  }, [data, filterText, filterTeam, sortConfig, rules]);

  const handleTeamChange = (uid, val) =>
    setData((p) => p.map((e) => (e.uid === uid ? { ...e, team: val } : e)));

  const recommendTeam = (employee) => {
    const teamScores = TEAMS_CONFIG.map((t) => ({
      name: t.name,
      score: data
        .filter((e) => e.team === t.name)
        .reduce((sum, m) => sum + calculateTotal(m.scores, rules), 0),
    }));
    teamScores.sort((a, b) => a.score - b.score);
    handleTeamChange(employee.uid, teamScores[0].name);
  };

  const getTeamStyle = (teamName) => {
    if (!teamName) return "border-red-300 text-red-600 font-bold bg-red-50";
    const team = TEAMS_CONFIG.find((t) => t.name === teamName);
    if (!team) return "border-slate-300";
    return `${team.bg} ${team.text} border-${team.color}-200 font-bold`;
  };

  const SortableHeader = ({ label, sortKey, className = "" }) => (
    <th
      className={`px-4 py-3 cursor-pointer hover:bg-slate-200 transition-colors group text-center select-none ${className}`}
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center justify-center gap-1">
        {label}
        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity">
          <ChevronUp
            className={`w-3 h-3 -mb-1 ${
              sortConfig.key === sortKey && sortConfig.direction === "asc"
                ? "text-teal-600 opacity-100"
                : "text-slate-400"
            }`}
          />
          <ChevronDown
            className={`w-3 h-3 -mt-1 ${
              sortConfig.key === sortKey && sortConfig.direction === "desc"
                ? "text-teal-600 opacity-100"
                : "text-slate-400"
            }`}
          />
        </div>
      </div>
    </th>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full text-center">
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row justify-between items-center bg-slate-50 gap-4 text-center">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <Users className="w-4 h-4 text-teal-600" /> 員工名單 (
          {filteredData.length})
        </h3>
        <div className="flex flex-wrap md:flex-nowrap justify-end items-center gap-2">
          <select
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="border border-slate-300 rounded px-2 py-2 text-sm text-center"
          >
            <option value="all">所有隊伍</option>
            <option value="unassigned">未分發</option>
            {TEAMS_CONFIG.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="搜尋..."
              className="pl-9 pr-4 py-2 border border-slate-300 rounded text-sm w-32 md:w-48 text-center"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
          <div className="h-6 w-px bg-slate-200 mx-1 hidden md:block"></div>
          <button
            onClick={onClear}
            className="flex gap-1 px-3 py-2 bg-white border border-red-200 text-red-600 rounded hover:bg-red-50 text-sm"
          >
            <Trash2 className="w-4 h-4" /> 清空
          </button>
          <button
            onClick={onAdd}
            className="flex gap-1 px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm"
          >
            <UserPlus className="w-4 h-4" /> 新增
          </button>
          <input
            type="file"
            ref={onImportRef}
            onChange={onImport}
            className="hidden"
            accept=".xlsx,.xls,.csv"
          />
          <button
            onClick={() => onImportRef.current.click()}
            className="flex gap-1 px-3 py-2 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm"
          >
            <Upload className="w-4 h-4" /> 匯入
          </button>
          <button
            onClick={onExport}
            className="flex gap-1 px-3 py-2 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 text-sm"
          >
            <Download className="w-4 h-4" /> 匯出
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-center text-sm text-slate-600 border-collapse">
          <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 text-center">
            <tr>
              <SortableHeader
                label="隊伍"
                sortKey="team"
                className="bg-teal-50"
              />
              <SortableHeader label="工號" sortKey="id" />
              <SortableHeader label="姓名" sortKey="name" />
              <SortableHeader label="性別" sortKey="gender" />
              {Object.keys(SPORTS_META).map((key) => (
                <SortableHeader
                  key={key}
                  label={SPORTS_META[key].label}
                  sortKey={`scores.${key}`}
                  className={`bg-${SPORTS_META[key].color}-50`}
                />
              ))}
              <SortableHeader label="總分" sortKey="total" />
              <th className="px-4 py-3 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.map((emp) => (
              <tr
                key={emp.uid}
                className={`hover:bg-slate-50 cursor-pointer group ${
                  !emp.team ? "bg-red-50/50" : ""
                }`}
                onClick={() => onView(emp)}
              >
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-center gap-2">
                    <select
                      value={emp.team}
                      onChange={(e) =>
                        handleTeamChange(emp.uid, e.target.value)
                      }
                      className={`text-xs p-1 rounded border text-center transition-colors ${getTeamStyle(
                        emp.team
                      )}`}
                    >
                      <option
                        value=""
                        className="bg-white text-slate-400 italic"
                      >
                        -- 未分發 --
                      </option>
                      {TEAMS_CONFIG.map((t) => (
                        <option
                          key={t.id}
                          value={t.name}
                          className={`${t.bg} ${t.text}`}
                        >
                          {t.name.split(" ")[0]}
                        </option>
                      ))}
                    </select>
                    {!emp.team && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          recommendTeam(emp);
                        }}
                        className="p-1 bg-teal-100 text-teal-700 rounded hover:bg-teal-200"
                      >
                        <Sparkles className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">{emp.id}</td>
                <td className="px-4 py-3 font-medium text-center">
                  {emp.name}{" "}
                  {emp.relation !== "同仁" && (
                    <span className="text-xs bg-teal-50 px-1 rounded">眷</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">{emp.gender}</td>
                {Object.keys(SPORTS_META).map((key) => {
                  const meta = SPORTS_META[key];
                  const posField = meta.posField || key;
                  // 使用 formatPos 統一顯示
                  const displayPos = formatPos(key, emp.pos[posField]);
                  return (
                    <td
                      key={key}
                      className={`px-4 py-3 text-center bg-${meta.color}-50/20`}
                    >
                      <span className="font-bold">{emp.scores[key]}</span>
                      {(displayPos ||
                        (meta.hasDefense && emp.pos[`${key}Defense`])) && (
                        <div className="text-xs text-slate-400">
                          {displayPos}{" "}
                          {meta.hasDefense && emp.pos[`${key}Defense`]
                            ? `(${emp.pos[`${key}Defense`]})`
                            : ""}
                        </div>
                      )}
                    </td>
                  );
                })}
                <td className="px-4 py-3 font-bold text-teal-700 text-center">
                  {calculateTotal(emp.scores, rules).toFixed(1)}
                </td>
                <td
                  className="px-4 py-3 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => onView(emp)}
                      className="text-slate-400 hover:text-teal-500 p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(emp)}
                      className="text-slate-400 hover:text-blue-500 p-1"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(emp.uid)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CompactMemberCard = ({
  member,
  score,
  detail,
  onMove,
  mainName,
  onViewDetails,
  isHovered,
  setHoveredUid,
}) => (
  <div
    className={`p-2 rounded border transition-colors flex justify-between items-center text-xs mb-1 relative
            ${
              isHovered
                ? "bg-yellow-50 border-yellow-400 ring-1 ring-yellow-400 z-10 shadow-md"
                : "bg-slate-700/50 border-slate-600/50 hover:border-slate-500 hover:bg-slate-700"
            }`}
    onMouseEnter={() => setHoveredUid(member.uid)}
    onMouseLeave={() => setHoveredUid(null)}
    onClick={() => onViewDetails(member)}
    style={{ cursor: "pointer" }}
  >
    <div className="flex-1 min-w-0 mr-2 pointer-events-none">
      <div className="flex items-center gap-1 mb-0.5">
        <span
          className={`font-bold truncate ${
            isHovered ? "text-slate-900" : "text-slate-300"
          }`}
        >
          {member.name}
        </span>
        {member.relation !== "同仁" && (
          <span className="px-1 py-0.5 rounded bg-pink-900/50 text-pink-300 text-[9px]">
            眷
          </span>
        )}
      </div>
      {member.relation !== "同仁" ? (
        <div
          className={`text-[10px] truncate flex items-center gap-1 ${
            isHovered ? "text-slate-600" : "text-teal-400"
          }`}
        >
          <Users2 className="w-2.5 h-2.5" /> {mainName} 的眷屬
        </div>
      ) : (
        detail && (
          <div
            className={`text-[10px] truncate ${
              isHovered ? "text-slate-600" : "text-slate-500"
            }`}
          >
            {detail}
          </div>
        )
      )}
    </div>

    <div className="flex flex-col items-end gap-1">
      {score > 0 && (
        <span
          className={`font-mono font-bold text-[10px] ${
            isHovered ? "text-slate-800" : "text-teal-400"
          }`}
        >
          {score}
        </span>
      )}
      <select
        value={member.team}
        onChange={(e) => onMove(member.uid, e.target.value)}
        className={`text-[10px] border rounded px-1 py-0.5 outline-none w-16 cursor-pointer pointer-events-auto
                    ${
                      isHovered
                        ? "bg-white border-slate-400 text-slate-800"
                        : "bg-slate-800 text-slate-400 border-slate-600 hover:bg-slate-700"
                    }
                `}
        onClick={(e) => e.stopPropagation()}
      >
        {TEAMS_CONFIG.map((t) => (
          <option key={t.id} value={t.name}>
            {t.name.split(" ")[0]}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const SportGroup = ({
  meta,
  members,
  onMove,
  expanded,
  onToggle,
  mainNameMap,
  onViewDetails,
  hoveredUid,
  setHoveredUid,
}) => {
  const subGroups = useMemo(() => {
    if (!meta.hasPos) return null;
    if (members.length === 0) return null;

    const groups = {};

    members.forEach((m) => {
      const posField = meta.posField || meta.id;
      let pos = m.pos[posField];

      let groupKey = "其他";

      if (meta.id === "basketball") {
        if (safeIncludes(pos, "中鋒") || safeIncludes(pos, "5"))
          groupKey = "中鋒";
        else if (safeIncludes(pos, "大前鋒") || safeIncludes(pos, "4"))
          groupKey = "前鋒";
        else if (safeIncludes(pos, "小前鋒") || safeIncludes(pos, "3"))
          groupKey = "前鋒";
        else if (safeIncludes(pos, "得分") || safeIncludes(pos, "2"))
          groupKey = "後衛";
        else if (safeIncludes(pos, "控球") || safeIncludes(pos, "1"))
          groupKey = "後衛";
      } else if (meta.id === "softball") {
        if (safeIncludes(pos, "投手") || safeIncludes(pos, "p"))
          groupKey = "投手";
        else if (
          safeIncludes(pos, "內野") ||
          safeIncludes(pos, "一壘") ||
          safeIncludes(pos, "二壘") ||
          safeIncludes(pos, "三壘") ||
          safeIncludes(pos, "游擊")
        )
          groupKey = "內野";
        else if (safeIncludes(pos, "外野")) groupKey = "外野";
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(m);
    });

    const keys = Object.keys(groups);
    if (keys.length === 1 && keys[0] === "其他") return null;

    return groups;
  }, [members, meta]);

  if (members.length === 0) return null;

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider p-1.5 rounded hover:bg-slate-700/50 transition-colors ${
          expanded ? `text-${meta.color}-400` : "text-slate-500"
        }`}
      >
        <div className="flex items-center gap-2">
          <meta.icon className="w-3 h-3" /> {meta.label} ({members.length})
        </div>
        {expanded ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
      </button>

      {expanded && (
        <div className="mt-1 space-y-1 pl-1 border-l-2 border-slate-700 ml-1.5">
          {subGroups
            ? Object.keys(subGroups)
                .sort()
                .map((groupName) => (
                  <div key={groupName} className="mb-2">
                    <div className="text-[10px] font-bold text-slate-500 mb-1 pl-1">
                      {groupName}
                    </div>
                    {subGroups[groupName].map((m) => {
                      const posField = meta.posField || meta.id;
                      // 使用 formatPos 統一顯示卡片資訊
                      const posInfo =
                        formatPos(meta.id, m.pos[posField]) ||
                        (meta.hasDefense ? m.pos[`${meta.id}Defense`] : "") ||
                        "";
                      return (
                        <CompactMemberCard
                          key={`${meta.id}-${m.uid}`}
                          member={m}
                          score={m.scores[meta.id]}
                          detail={posInfo}
                          onMove={onMove}
                          mainName={mainNameMap[m.linkId]}
                          onViewDetails={onViewDetails}
                          isHovered={hoveredUid === m.uid}
                          setHoveredUid={setHoveredUid}
                        />
                      );
                    })}
                  </div>
                ))
            : members.map((m) => {
                const posField = meta.posField || meta.id;
                const posInfo =
                  formatPos(meta.id, m.pos[posField]) ||
                  (meta.hasDefense ? m.pos[`${meta.id}Defense`] : "") ||
                  "";
                return (
                  <CompactMemberCard
                    key={`${meta.id}-${m.uid}`}
                    member={m}
                    score={m.scores[meta.id]}
                    detail={posInfo}
                    onMove={onMove}
                    mainName={mainNameMap[m.linkId]}
                    onViewDetails={onViewDetails}
                    isHovered={hoveredUid === m.uid}
                    setHoveredUid={setHoveredUid}
                  />
                );
              })}
        </div>
      )}
    </div>
  );
};

const DraftRoomModal = ({
  draftState,
  onNext,
  onAuto,
  onManualMove,
  onSave,
  onCancel,
  rules,
  onPick,
  onView,
}) => {
  if (!draftState.isActive) return null;

  const [viewMode, setViewMode] = useState("kanban");
  const [expandedSports, setExpandedSports] = useState(() => {
    const initial = {};
    Object.keys(SPORTS_META).forEach((k) => (initial[k] = true));
    initial["reserve"] = true;
    return initial;
  });
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [hoveredUid, setHoveredUid] = useState(null);

  const [internalFilters, setInternalFilters] = useState(() => {
    const initial = {};
    Object.keys(SPORTS_META).forEach((k) => (initial[k] = 0));
    return initial;
  });

  const toggleSport = (key) =>
    setExpandedSports((p) => ({ ...p, [key]: !p[key] }));

  const mainNameMap = useMemo(() => {
    const map = {};
    draftState.originalEmployees.forEach((e) => {
      if (e.identity === "本人") map[e.id] = e.name;
    });
    return map;
  }, [draftState.originalEmployees]);

  const nextUp =
    draftState.queue.length > 0
      ? draftState.queue[draftState.customPickIndex]
      : null;

  const getHighlightInfo = (group) => {
    let maxSport = "",
      maxScore = 0;
    Object.keys(group.sportValues).forEach((k) => {
      if (group.sportValues[k].score > maxScore) {
        maxScore = group.sportValues[k].score;
        maxSport = k;
      }
    });

    const posDetails = [];
    const members = group.members;

    // 使用 formatPos 統一顯示高亮資訊
    const basketballPos = members
      .map((m) => formatPos("basketball", m.pos?.basketball))
      .filter((p) => p)
      .join(", ");
    if (basketballPos) posDetails.push(`🏀 ${basketballPos}`);

    const softballPos = members
      .map((m) => m.pos?.softball)
      .filter((p) => p)
      .join(", ");
    const softballDef = members
      .map((m) => m.pos?.softballDefense)
      .filter((p) => p)
      .join(", ");
    if (softballPos || softballDef)
      posDetails.push(
        `⚾ ${softballPos}${softballDef ? `(${softballDef})` : ""}`
      );

    const scoreText =
      maxScore === 0 ? "無戰力" : `${SPORTS_META[maxSport].label} ${maxScore}`;

    return (
      <div className="flex flex-col gap-0.5">
        <div className="font-bold text-teal-400">{scoreText}</div>
        {posDetails.length > 0 && (
          <div className="text-[10px] text-slate-400">
            {posDetails.join(" | ")}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col animate-fade-in text-white overflow-hidden">
      <div className="bg-slate-800 border-b border-slate-700 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-teal-600 rounded-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">智慧分組面板</h2>
            <div className="flex items-center gap-3 text-sm text-slate-400">
              <span>待分配: {draftState.queue.length} 組</span>
              <span className="w-px h-3 bg-slate-600"></span>
              <span>已分配: {draftState.assigned.length} 人</span>
            </div>
          </div>
        </div>

        <div className="flex bg-slate-700 rounded-lg p-1 items-center">
          <button
            onClick={() => setViewMode("kanban")}
            className={`px-3 py-2 rounded flex items-center gap-2 text-sm font-bold transition-all h-9 ${
              viewMode === "kanban"
                ? "bg-teal-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Kanban className="w-4 h-4" /> 看板模式
          </button>
          <button
            onClick={() => setViewMode("stats")}
            className={`px-3 py-2 rounded flex items-center gap-2 text-sm font-bold transition-all h-9 ${
              viewMode === "stats"
                ? "bg-teal-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Table2 className="w-4 h-4" /> 即時統計
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-700 px-3 py-2 h-9 rounded border border-slate-600">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-300 font-bold">看板門檻:</span>
            <select
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(parseFloat(e.target.value))}
              className="bg-slate-900 text-teal-400 text-sm font-mono font-bold outline-none border border-slate-600 rounded px-2 py-0.5 cursor-pointer hover:border-slate-500"
            >
              <option value="0">全部顯示 (All)</option>
              <option value="0.5">&ge; 0.5 分</option>
              <option value="1">&ge; 1.0 分</option>
              <option value="1.5">&ge; 1.5 分</option>
              <option value="2">&ge; 2.0 分</option>
              <option value="3">&ge; 3.0 分</option>
            </select>
          </div>

          <div className="h-8 w-px bg-slate-700 mx-2"></div>

          <button
            onClick={onCancel}
            className="px-4 py-2 h-9 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 font-medium text-sm flex items-center"
          >
            返回首頁
          </button>
          <button
            onClick={onSave}
            className="px-6 py-2 h-9 bg-teal-600 hover:bg-teal-500 rounded text-white font-bold shadow-lg flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" /> 儲存結果
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左側：待選清單 */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col shadow-xl z-10 shrink-0">
          <div className="p-3 bg-slate-900/50 font-bold text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700 flex justify-between items-center">
            <span>待選名單 (Queue)</span>
            <span className="bg-teal-900 text-teal-200 px-1.5 rounded">
              {draftState.queue.length}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {draftState.queue.map((group, idx) => {
              const isSelected = idx === draftState.customPickIndex;
              return (
                <div
                  key={group.id}
                  onClick={() => onPick(idx)}
                  className={`p-3 rounded border transition-all cursor-pointer hover:bg-slate-700 ${
                    isSelected
                      ? "bg-teal-900/30 border-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)] ring-1 ring-teal-500"
                      : "bg-slate-700/50 border-slate-600 opacity-70"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`font-bold text-sm ${
                        isSelected ? "text-white" : "text-slate-300"
                      }`}
                    >
                      {group.members[0].name}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-teal-600 px-1 rounded text-white">
                        NEXT
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mb-1">
                    {group.members.length > 1
                      ? `+${group.members.length - 1} 家眷`
                      : group.members[0].dept}
                  </div>
                  <div className="text-xs font-mono text-teal-400">
                    {getHighlightInfo(group)}
                  </div>
                </div>
              );
            })}
            {draftState.queue.length === 0 && (
              <div className="text-center py-10 text-slate-500 italic">
                分配完成
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-800 border-t border-slate-700 space-y-3">
            <button
              onClick={onNext}
              disabled={!nextUp || draftState.isAutoRunning}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded shadow flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> 分配下一位
            </button>
            <button
              onClick={onAuto}
              disabled={!nextUp && !draftState.isAutoRunning}
              className={`w-full py-2 font-medium rounded flex items-center justify-center gap-2 text-sm ${
                draftState.isAutoRunning
                  ? "bg-red-600 hover:bg-red-500 text-white animate-pulse"
                  : "bg-slate-700 hover:bg-slate-600 text-slate-300"
              }`}
            >
              {draftState.isAutoRunning ? (
                <>
                  <Pause className="w-4 h-4" /> 停止自動分配
                </>
              ) : (
                <>
                  <FastForward className="w-4 h-4" /> 自動完成剩餘
                </>
              )}
            </button>
          </div>
        </div>

        {/* 右側：主顯示區 (看板或統計) */}
        <div className="flex-1 bg-slate-900 p-4 overflow-x-auto relative">
          {viewMode === "kanban" ? (
            <div className="h-full flex gap-4 min-w-max">
              {TEAMS_CONFIG.map((team, idx) => {
                const isCurrentTurn = draftState.currentTeamIdx === idx;
                const members = draftState.assigned.filter(
                  (m) => m.team === team.name
                );
                const totalScore = members.reduce(
                  (sum, m) => sum + calculateTotal(m.scores, rules),
                  0
                );

                const sportGroups = Object.keys(SPORTS_META).map((sportKey) => {
                  const meta = SPORTS_META[sportKey];
                  const threshold = Math.max(
                    rules.enableThresholds
                      ? rules.thresholds[sportKey] || 0
                      : 0,
                    minScoreFilter
                  );
                  const validMembers = members
                    .filter((m) => (m.scores[sportKey] || 0) > threshold)
                    .sort((a, b) => b.scores[sportKey] - a.scores[sportKey]);

                  return { key: sportKey, meta, members: validMembers };
                });

                const reserveMembers =
                  minScoreFilter > 0
                    ? []
                    : members.filter((m) => {
                        return !Object.keys(SPORTS_META).some((k) => {
                          const threshold = rules.enableThresholds
                            ? rules.thresholds[k] || 0
                            : 0;
                          return (m.scores[k] || 0) > threshold;
                        });
                      });

                return (
                  <div
                    key={team.id}
                    className={`w-64 flex flex-col rounded-xl border-2 transition-all duration-300 ${
                      isCurrentTurn
                        ? `border-${team.color}-500 bg-slate-800 shadow-[0_0_20px_rgba(var(--color-${team.color}-500),0.3)] translate-y-[-4px]`
                        : "border-slate-700 bg-slate-800/50"
                    }`}
                  >
                    <div
                      className={`p-3 border-b border-slate-700 bg-${team.color}-900/20 rounded-t-lg shrink-0`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3
                          className={`font-bold text-lg text-${team.color}-400`}
                        >
                          {team.name.split(" ")[0]}
                        </h3>
                        {isCurrentTurn && (
                          <div className="animate-pulse bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                            選人中
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="text-2xl font-black text-slate-200">
                          {totalScore.toFixed(1)}{" "}
                          <span className="text-xs font-normal text-slate-500">
                            分
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {members.length} 人
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                      {sportGroups.map(({ key, meta, members: smembers }) => (
                        <SportGroup
                          key={key}
                          meta={meta}
                          members={smembers}
                          onMove={onManualMove}
                          expanded={expandedSports[key]}
                          onToggle={() => toggleSport(key)}
                          mainNameMap={mainNameMap}
                          onViewDetails={onView}
                          hoveredUid={hoveredUid}
                          setHoveredUid={setHoveredUid}
                        />
                      ))}

                      {reserveMembers.length > 0 && (
                        <div className="mb-2">
                          <button
                            onClick={() => toggleSport("reserve")}
                            className={`w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider p-1.5 rounded hover:bg-slate-700/50 transition-colors ${
                              expandedSports["reserve"]
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <UserPlus className="w-3 h-3" /> 儲備戰力 (
                              {reserveMembers.length})
                            </div>
                            {expandedSports["reserve"] ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                          </button>
                          {expandedSports["reserve"] && (
                            <div className="mt-1 space-y-1 pl-1 border-l-2 border-slate-700 ml-1.5">
                              {reserveMembers.map((m) => (
                                <CompactMemberCard
                                  key={`res-${m.uid}`}
                                  member={m}
                                  score={0}
                                  detail={m.dept}
                                  onMove={onManualMove}
                                  mainName={mainNameMap[m.linkId]}
                                  onViewDetails={onView}
                                  isHovered={hoveredUid === m.uid}
                                  setHoveredUid={setHoveredUid}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 overflow-auto h-full shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Table2 className="w-6 h-6 text-teal-400" /> 即時戰力平衡表
              </h3>
              {/* 使用共用的 StatsTables 元件，傳入深色模式參數 */}
              <StatsTables
                employees={draftState.assigned}
                rules={rules}
                filters={internalFilters}
                onFilterChange={setInternalFilters}
                darkMode={true}
              />
              <div className="mt-6 text-xs text-slate-500 text-center">
                * 此統計表僅包含已分發的成員，並可使用表頭選單進行獨立篩選。
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Modals ---

const AboutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Info className="w-6 h-6 text-teal-600" /> 系統功能說明
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 text-slate-600">
          <section>
            <h4 className="font-bold text-teal-700 flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4" /> 智慧分組邏輯
            </h4>
            <p className="text-sm">
              系統採用 S 型 (Snake Draft)
              選秀邏輯，根據人員的積分高低進行排序分配。同時支援家庭成員（同仁+眷屬）綁定分配，確保家人分在同一隊伍。
            </p>
          </section>

          <section>
            <h4 className="font-bold text-teal-700 flex items-center gap-2 mb-2">
              <Users2 className="w-4 h-4" /> 資料管理與匯入
            </h4>
            <p className="text-sm">
              支援 Excel
              檔案匯入與匯出。系統會自動辨識欄位並建立人員資料庫。您也可以在系統內直接新增、編輯或刪除人員資料。
            </p>
          </section>

          <section>
            <h4 className="font-bold text-teal-700 flex items-center gap-2 mb-2">
              <FileSpreadsheet className="w-4 h-4" /> 統計分析
            </h4>
            <p className="text-sm">
              提供即時的各隊戰力積分統計表與各項運動人數分佈表。在「智慧分組面板」中，統計表會隨著分發進度即時更新。
            </p>
          </section>

          <section>
            <h4 className="font-bold text-teal-700 flex items-center gap-2 mb-2">
              <Settings className="w-4 h-4" /> 規則自訂
            </h4>
            <p className="text-sm">
              可自訂各項運動的優先分配順序、特定位置（如籃球中鋒、壘球投手）的權重，以及設定低分忽略門檻，讓分組結果更符合實際需求。
            </p>
          </section>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          MOXA Sports Day Team Divider System © 2026
        </div>
      </div>
    </div>
  );
};

const ChangelogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-teal-600" /> 版本更新歷程
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="space-y-4 text-sm text-slate-600">
          <div className="border-l-2 border-teal-500 pl-4">
            <div className="font-bold text-slate-800 text-lg">
              V1.0.0 正式版
            </div>
            <p className="mt-2 mb-2 font-medium text-teal-700">
              MOXA 運動會智慧分組系統正式發布
            </p>
            <ul className="list-disc list-inside mt-1 space-y-2 marker:text-teal-500">
              <li>
                <strong>智慧分組核心：</strong>S
                型選秀演算法自動平衡戰力，支援家庭成員綁定。
              </li>
              <li>
                <strong>即時戰情面板：</strong>
                提供「看板模式」與「即時統計」雙視圖，視覺化呈現分組進度。
              </li>
              <li>
                <strong>完整資料管理：</strong>Excel
                匯入/匯出、線上編輯人員資料、自動儲存。
              </li>
              <li>
                <strong>多維度統計：</strong>
                自動計算各運動積分、位置人數（如籃球中鋒、壘球投手）分佈。
              </li>
              <li>
                <strong>彈性規則：</strong>
                可自訂運動優先序、位置權重及低分忽略門檻。
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 mb-6 text-sm">{message}</p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            確認執行
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployeeViewModal = ({ isOpen, onClose, employee, onEdit }) => {
  if (!isOpen || !employee) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 animate-fade-in text-left z-[1000]">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
              {employee.name[0]}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {employee.name}
              </h3>
              <p className="text-xs text-slate-500">
                {employee.id} | {employee.dept}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm mb-6">
            {[
              [
                "隊伍",
                employee.team || "未分發",
                !employee.team ? "text-red-500 font-bold" : "font-bold",
              ],
              ["公司", employee.company],
              ["部門代號", employee.deptCode],
              ["性別", employee.gender],
              ["身份/關係", `${employee.identity} / ${employee.relation}`],
              ["人員類型", employee.type],
              ["身高", employee.height || "-"],
              ["L Band", employee.lBand || "-"],
            ].map(([label, val, className]) => (
              <div key={label}>
                <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">
                  {label}
                </span>
                <span
                  className={`font-medium text-slate-700 ${className || ""}`}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
          <hr className="border-slate-100 mb-6" />
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-teal-600" /> 運動戰力表
          </h4>
          <div className="space-y-3">
            {Object.keys(SPORTS_META).map((key) => {
              const meta = SPORTS_META[key];
              const score = employee.scores[key];
              const posField = meta.posField || key;
              const posVal = employee.pos[posField];
              const defVal = meta.hasDefense
                ? employee.pos[`${key}Defense`]
                : null;
              // 格式化顯示
              const displayPos = formatPos(key, posVal);

              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-3 bg-${meta.color}-50 rounded border border-${meta.color}-100`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 bg-white rounded-full text-${meta.color}-600`}
                    >
                      <meta.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-700">
                        {meta.label}
                      </div>
                      {(displayPos || defVal) && (
                        <div className="text-xs text-slate-500">
                          {displayPos || "-"} {defVal && ` (${defVal})`}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`text-xl font-bold text-${meta.color}-700`}>
                    {score}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded font-medium transition-colors"
          >
            關閉
          </button>
          {onEdit && (
            <button
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 shadow-sm flex items-center gap-2 font-medium transition-colors"
            >
              <Pencil className="w-4 h-4" /> 編輯資料
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const EmployeeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "add",
}) => {
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if (!isOpen) return;
    const base = {
      id: "",
      name: "",
      dept: "",
      deptCode: "",
      gender: "M",
      relation: "同仁",
      company: "四零四",
      identity: "本人",
      height: "",
      lBand: "",
      type: "正式",
    };

    Object.keys(SPORTS_META).forEach((key) => {
      base[key] = 0;
      const meta = SPORTS_META[key];
      const posField = meta.posField || key;
      const CapPos = posField.charAt(0).toUpperCase() + posField.slice(1);
      base[`pos${CapPos}`] = "";
      if (meta.hasDefense)
        base[`pos${key.charAt(0).toUpperCase() + key.slice(1)}Defense`] = "";
    });

    if (mode === "edit" && initialData) {
      const mapped = { ...base, ...initialData };
      Object.keys(SPORTS_META).forEach((key) => {
        mapped[key] = initialData.scores?.[key] ?? 0;
        const meta = SPORTS_META[key];
        const posField = meta.posField || key;
        const CapPos = posField.charAt(0).toUpperCase() + posField.slice(1);
        mapped[`pos${CapPos}`] = initialData.pos?.[posField] ?? "";
        if (meta.hasDefense) {
          const CapSport = key.charAt(0).toUpperCase() + key.slice(1);
          mapped[`pos${CapSport}Defense`] =
            initialData.pos?.[`${key}Defense`] ?? "";
        }
      });
      setFormData(mapped);
    } else {
      setFormData(base);
    }
  }, [isOpen, mode, initialData]);

  if (!isOpen) return null;
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto text-left">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          {mode === "edit" ? (
            <Pencil className="w-5 h-5 text-teal-600" />
          ) : (
            <UserPlus className="w-5 h-5 text-teal-600" />
          )}{" "}
          {mode === "edit" ? "編輯人員資料" : "新增人員"}
        </h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
            onClose();
          }}
          className="space-y-4 text-sm"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                工號 <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="id"
                type="text"
                className="w-full border rounded p-2"
                value={formData.id ?? ""}
                onChange={handleChange}
                disabled={mode === "edit"}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                姓名 <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="name"
                type="text"
                className="w-full border rounded p-2"
                value={formData.name ?? ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                部門
              </label>
              <input
                name="dept"
                className="w-full border rounded p-2"
                value={formData.dept ?? ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                部門縮寫
              </label>
              <input
                name="deptCode"
                className="w-full border rounded p-2"
                value={formData.deptCode ?? ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                性別
              </label>
              <select
                name="gender"
                className="w-full border rounded p-2"
                value={formData.gender ?? "M"}
                onChange={handleChange}
              >
                <option value="M">男</option>
                <option value="F">女</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                關係
              </label>
              <select
                name="relation"
                className="w-full border rounded p-2"
                value={formData.relation ?? "同仁"}
                onChange={handleChange}
              >
                <option value="同仁">同仁</option>
                <option value="眷屬">眷屬</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                類型
              </label>
              <select
                name="type"
                className="w-full border rounded p-2"
                value={formData.type ?? "正式"}
                onChange={handleChange}
              >
                <option value="正式">正式</option>
                <option value="臨時">臨時</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                身份
              </label>
              <input
                name="identity"
                className="w-full border rounded p-2"
                value={formData.identity ?? ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                L Band
              </label>
              <input
                name="lBand"
                className="w-full border rounded p-2"
                value={formData.lBand ?? ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                身高
              </label>
              <input
                name="height"
                className="w-full border rounded p-2"
                value={formData.height ?? ""}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                公司別
              </label>
              <input
                name="company"
                className="w-full border rounded p-2"
                value={formData.company ?? ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <hr className="border-slate-100" />
          <div className="space-y-3">
            <h4 className="font-bold text-slate-700 flex items-center gap-2">
              <Dumbbell className="w-4 h-4" /> 運動評分與位置
            </h4>
            {Object.keys(SPORTS_META).map((key) => {
              const meta = SPORTS_META[key];
              const posField = meta.posField || key;
              const CapPos =
                posField.charAt(0).toUpperCase() + posField.slice(1);
              const CapSport = key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <div
                  key={key}
                  className="flex items-center gap-3 bg-slate-50 p-2 rounded border border-slate-100"
                >
                  <label className="w-32 font-medium text-slate-600 flex items-center gap-2 shrink-0">
                    <meta.icon className={`w-4 h-4 text-${meta.color}-500`} />{" "}
                    {meta.label}{" "}
                    <span className="text-xs text-slate-400">(0-3)</span>
                  </label>
                  <input
                    name={key}
                    type="number"
                    step="0.5"
                    max="3"
                    min="0"
                    className="w-20 border rounded p-1 text-center shrink-0"
                    value={formData[key] ?? 0}
                    onChange={handleChange}
                  />
                  <div className="flex-1 min-w-0">
                    {meta.hasPos ? (
                      <div className="flex gap-1">
                        {meta.posOptions ? (
                          <select
                            name={`pos${CapPos}`}
                            className={`border rounded p-1 text-xs ${
                              meta.hasDefense ? "w-1/2" : "w-full"
                            }`}
                            value={formData[`pos${CapPos}`] ?? ""}
                            onChange={handleChange}
                          >
                            {meta.posOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt || `選擇${meta.posLabel}`}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            name={`pos${CapPos}`}
                            type="text"
                            className={`border rounded p-1 text-xs ${
                              meta.hasDefense ? "w-1/2" : "w-full"
                            }`}
                            placeholder={meta.posLabel}
                            value={formData[`pos${CapPos}`] ?? ""}
                            onChange={handleChange}
                          />
                        )}

                        {meta.hasDefense &&
                          (meta.defOptions ? (
                            <select
                              name={`pos${CapSport}Defense`}
                              className="border rounded p-1 w-1/2 text-xs"
                              value={formData[`pos${CapSport}Defense`] ?? ""}
                              onChange={handleChange}
                            >
                              {meta.defOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt || `選擇${meta.defLabel}`}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              name={`pos${CapSport}Defense`}
                              type="text"
                              className="border rounded p-1 w-1/2 text-xs"
                              placeholder={meta.defLabel}
                              value={formData[`pos${CapSport}Defense`] ?? ""}
                              onChange={handleChange}
                            />
                          ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 shadow-sm"
            >
              {mode === "edit" ? "儲存變更" : "確認新增"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * SECTION 5: MAIN APP ORCHESTRATOR (主程式入口)
 * ============================================================================
 */

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employees, setEmployees] = useState(INITIAL_DATA);
  const [rules, setRules] = useState(DEFAULT_RULES);
  const [priorityConfig, setPriorityConfig] = useState(DEFAULT_PRIORITY_CONFIG);

  // Hooks
  const {
    draftState,
    prepareDraft,
    nextStep,
    toggleAuto,
    manualMove,
    saveAndExit,
    cancelDraft,
    setCustomPick,
  } = useTeamDistributor(employees, rules, priorityConfig, setEmployees);
  const { fileInputRef, handleImport, handleExport } = useFileHandler(
    employees,
    rules,
    setEmployees
  );

  const [scoreFilters, setScoreFilters] = useState(() => {
    const initial = {};
    Object.keys(SPORTS_META).forEach((k) => (initial[k] = 0));
    return initial;
  });

  // 增加 readOnly 狀態，用於控制 EmployeeViewModal 是否顯示編輯按鈕
  // 增加 about 狀態，用於控制 AboutModal
  const [modals, setModals] = useState({
    add: false,
    view: false,
    edit: null,
    viewData: null,
    clear: false,
    log: false,
    about: false,
    readOnly: false,
  });
  const toggleModal = (key, val = true) =>
    setModals((p) => ({ ...p, [key]: val }));

  // Dashboard 統計數據
  const stats = useMemo(() => {
    return {
      totalPeople: employees.length,
      totalFamilies: new Set(employees.map((e) => e.linkId)).size,
      totalScore: employees.reduce(
        (acc, curr) => acc + calculateTotal(curr.scores, rules),
        0
      ),
      unassignedCount: employees.filter((e) => !e.team).length,
    };
  }, [employees, rules]);

  // 新增/編輯員工處理
  const handleUpdate = (data) => {
    if (modals.edit) {
      setEmployees((p) =>
        p.map((e) =>
          e.uid === modals.edit.uid
            ? {
                ...e,
                ...data,
                scores: Object.keys(SPORTS_META).reduce(
                  (acc, k) => ({ ...acc, [k]: parseFloat(data[k] || 0) }),
                  {}
                ),
                pos: Object.keys(SPORTS_META).reduce((acc, k) => {
                  const f = SPORTS_META[k].posField || k;
                  acc[f] =
                    data[`pos${f.charAt(0).toUpperCase() + f.slice(1)}`] || "";
                  if (SPORTS_META[k].hasDefense)
                    acc[`${k}Defense`] =
                      data[
                        `pos${k.charAt(0).toUpperCase() + k.slice(1)}Defense`
                      ] || "";
                  return acc;
                }, {}),
              }
            : e
        )
      );
      if (modals.viewData?.uid === modals.edit.uid)
        setModals((p) => ({ ...p, viewData: { ...modals.viewData, ...data } }));
    } else {
      setEmployees((p) => [
        ...p,
        {
          uid: generateUUID(),
          ...data,
          scores: Object.keys(SPORTS_META).reduce(
            (acc, k) => ({ ...acc, [k]: parseFloat(data[k] || 0) }),
            {}
          ),
          pos: Object.keys(SPORTS_META).reduce((acc, k) => {
            const f = SPORTS_META[k].posField || k;
            acc[f] = data[`pos${f.charAt(0).toUpperCase() + f.slice(1)}`] || "";
            return acc;
          }, {}),
        },
      ]);
    }
    setModals((p) => ({ ...p, add: false, edit: null }));
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center space-x-4 cursor-pointer"
            onClick={() => toggleModal("log")}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/f6/Moxa_Logo.svg"
              alt="MOXA"
              className="h-6 md:h-8"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="text-2xl font-black text-teal-700 tracking-tighter hidden">
              MOXA
            </span>
            <div className="h-6 w-px bg-slate-300 mx-2"></div>
            <span className="text-lg font-bold text-slate-700 tracking-tight flex items-center gap-2">
              運動會分組系統{" "}
              <span className="bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full">
                V1.0.0正式版
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleModal("about")}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1"
              title="系統說明"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <nav className="flex space-x-1">
              {[
                { id: "dashboard", icon: LayoutDashboard, label: "總覽" },
                { id: "data", icon: Users, label: "資料庫" },
                { id: "stats", icon: FileSpreadsheet, label: "統計表" },
                { id: "settings", icon: Settings, label: "設定" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-2 rounded flex items-center gap-2 text-sm font-semibold ${
                    activeTab === t.id
                      ? "bg-teal-50 text-teal-700"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <t.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{t.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="總參加人數"
                value={stats.totalPeople}
                subtext={`包含 ${
                  employees.filter((e) => e.relation !== "同仁").length
                } 眷屬`}
                icon={Users}
                color="bg-teal-600"
              />
              <StatCard
                title="分組單位 (家庭)"
                value={stats.totalFamilies}
                subtext="分組時視為同一單位"
                icon={UserPlus}
                color="bg-slate-600"
              />
              <StatCard
                title="未分發人員"
                value={stats.unassignedCount}
                subtext={
                  stats.unassignedCount > 0 ? "請前往資料庫分發" : "全員就位"
                }
                icon={AlertCircle}
                color={
                  stats.unassignedCount > 0 ? "bg-red-600" : "bg-green-600"
                }
              />
            </div>
            <div className="bg-white p-10 rounded-lg shadow-sm border border-slate-200 text-center">
              <div className="mb-6 inline-flex p-4 bg-teal-50 rounded-full text-teal-700">
                <Trophy className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                MOXA Sports Day
              </h2>
              <p className="text-slate-500 mb-8">
                系統將自動平衡六大隊伍戰力，並確保家庭成員分配於同一隊伍。
              </p>

              <div className="flex flex-col items-center gap-2 mb-8">
                <div className="flex justify-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded border">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        rules.enablePriority ? "bg-teal-500" : "bg-slate-300"
                      }`}
                    ></div>
                    優先分配: {rules.enablePriority ? "ON" : "OFF"}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded border">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        rules.enableThresholds ? "bg-teal-500" : "bg-slate-300"
                      }`}
                    ></div>
                    低分忽略: {rules.enableThresholds ? "ON" : "OFF"}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("settings")}
                  className="text-teal-600 hover:text-teal-700 text-xs flex items-center gap-1 hover:underline"
                >
                  <Settings className="w-3 h-3" /> 前往設定調整規則
                </button>
              </div>

              <button
                onClick={prepareDraft}
                className="inline-flex items-center justify-center px-8 py-3 bg-teal-600 text-white text-lg font-bold rounded-md hover:bg-teal-700 shadow-md min-w-[200px]"
              >
                <Activity className="w-5 h-5 mr-2" />
                進入智慧分組面板
              </button>
            </div>
          </div>
        )}
        {activeTab === "data" && (
          <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            <div>
              <h2 className="text-xl font-bold text-slate-800">員工資料庫</h2>
              <p className="text-sm text-slate-500">
                此頁面可管理所有參加人員的評分與分隊現況。
              </p>
            </div>
            <EmployeeTable
              data={employees}
              setData={setEmployees}
              onDelete={(uid) =>
                setEmployees((p) => p.filter((e) => e.uid !== uid))
              }
              onEdit={(e) => setModals((p) => ({ ...p, add: true, edit: e }))}
              // 在資料庫頁面，設定 readOnly 為 false，允許編輯
              onView={(e) =>
                setModals((p) => ({
                  ...p,
                  view: true,
                  viewData: e,
                  readOnly: false,
                }))
              }
              onClear={() => toggleModal("clear")}
              onAdd={() => setModals((p) => ({ ...p, add: true, edit: null }))}
              rules={rules}
              onExport={handleExport}
              onImportRef={fileInputRef}
              onImport={handleImport}
            />
          </div>
        )}
        {activeTab === "stats" && (
          <div className="space-y-8 animate-fade-in text-center">
            {/* Header for Stats Table 1 */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-x-auto">
              {employees.some((e) => e.team) ? (
                <StatisticsTable
                  employees={employees}
                  rules={rules}
                  filters={scoreFilters}
                  onFilterChange={setScoreFilters}
                />
              ) : (
                <div className="text-center py-20 text-slate-500">
                  無分組數據
                </div>
              )}
            </div>

            {/* Table 2 is handled inside StatisticsTable component already but needs title update there */}
          </div>
        )}
        {activeTab === "settings" && (
          <SettingsPanel
            priorityConfig={priorityConfig}
            setPriorityConfig={setPriorityConfig}
            rules={rules}
            setRules={setRules}
          />
        )}
      </main>

      <EmployeeFormModal
        isOpen={modals.add}
        onClose={() => setModals((p) => ({ ...p, add: false, edit: null }))}
        onSubmit={handleUpdate}
        initialData={modals.edit}
        mode={modals.edit ? "edit" : "add"}
      />
      {/* 根據 readOnly 狀態決定是否傳遞 onEdit，從而控制是否顯示編輯按鈕 */}
      <EmployeeViewModal
        isOpen={modals.view}
        onClose={() =>
          setModals((p) => ({ ...p, view: false, viewData: null }))
        }
        employee={modals.viewData}
        onEdit={
          modals.readOnly
            ? null
            : (e) =>
                setModals((p) => ({ ...p, add: true, edit: e, view: false }))
        }
      />
      <ConfirmModal
        isOpen={modals.clear}
        onClose={() => toggleModal("clear", false)}
        onConfirm={() => {
          setEmployees([]);
          toggleModal("clear", false);
        }}
        title="清除所有資料"
        message="確定要清除所有資料嗎？"
      />
      <ChangelogModal
        isOpen={modals.log}
        onClose={() => toggleModal("log", false)}
      />
      <AboutModal
        isOpen={modals.about}
        onClose={() => toggleModal("about", false)}
      />

      {/* 選秀戰情室 Modal */}
      <DraftRoomModal
        draftState={draftState}
        onNext={nextStep}
        onAuto={toggleAuto}
        onManualMove={manualMove}
        onSave={saveAndExit}
        onCancel={cancelDraft}
        rules={rules}
        onPick={setCustomPick}
        // 在戰情室中，設定 readOnly 為 true，隱藏編輯按鈕
        onView={(e) =>
          setModals((p) => ({ ...p, view: true, viewData: e, readOnly: true }))
        }
      />
    </div>
  );
}
