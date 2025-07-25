import "./CharacterSheet.css";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBagIcon, DocumentTextIcon } from "@heroicons/react/24/solid";

const defaultImage = "/avatar.png";

type Stats = {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  reaction: number;
  charisma: number;
};

type SkillProficiency = 0 | 1;
type RegularSkillProficiency = 0 | 1 | 2;

type Skills = {
  strengthCheck: 0;
  strengthSave: SkillProficiency;
  athletics: RegularSkillProficiency;
  dexterityCheck: 0;
  dexteritySave: SkillProficiency;
  acrobatics: RegularSkillProficiency;
  sleightOfHand: RegularSkillProficiency;
  stealth: RegularSkillProficiency;
  constitutionCheck: 0;
  constitutionSave: SkillProficiency;
  intelligenceCheck: 0;
  intelligenceSave: SkillProficiency;
  investigation: RegularSkillProficiency;
  history: RegularSkillProficiency;
  hacking: RegularSkillProficiency;
  streetwise: RegularSkillProficiency;
  religion: RegularSkillProficiency;
  reactionCheck: 0;
  reactionSave: SkillProficiency;
  perception: RegularSkillProficiency;
  survival: RegularSkillProficiency;
  medicine: RegularSkillProficiency;
  insight: RegularSkillProficiency;
  driving: RegularSkillProficiency;
  charismaCheck: 0;
  charismaSave: SkillProficiency;
  performance: RegularSkillProficiency;
  intimidation: RegularSkillProficiency;
  deception: RegularSkillProficiency;
  persuasion: RegularSkillProficiency;
};

const abilities = [
  { key: "strength", label: "Сила" },
  { key: "dexterity", label: "Спритн." },
  { key: "constitution", label: "Статура" },
  { key: "intelligence", label: "Інт." },
  { key: "reaction", label: "Реакц." },
  { key: "charisma", label: "Харизма" },
] as const;

const roles = [
  "Корпорат", "Законик", "Нетранер", "Фіксер", "Кочівник", "Рокер", "Технік", "Медтехнік", "Медіа"
];

type SkillType = "check" | "save" | "skill";

type SkillDefinition = {
  key: keyof Skills;
  label: string;
  type: SkillType;
};

const skillGroups: {
  ability: keyof Stats;
  label: string;
  skills: SkillDefinition[];
}[] = [
  {
    ability: "strength",
    label: "СИЛА",
    skills: [
      { key: "strengthCheck", label: "Перевірка", type: "check" },
      { key: "strengthSave", label: "Рят. кидок", type: "save" },
      { key: "athletics", label: "Атлетика", type: "skill" }
    ]
  },
  {
    ability: "dexterity",
    label: "СПРИТНІСТЬ",
    skills: [
      { key: "dexterityCheck", label: "Перевірка", type: "check" },
      { key: "dexteritySave", label: "Рят. кидок", type: "save" },
      { key: "acrobatics", label: "Акробатика", type: "skill" },
      { key: "sleightOfHand", label: "Спритність рук", type: "skill" },
      { key: "stealth", label: "Скритність", type: "skill" }
    ]
  },
  {
    ability: "constitution",
    label: "СТАТУРА",
    skills: [
      { key: "constitutionCheck", label: "Перевірка", type: "check" },
      { key: "constitutionSave", label: "Рят. кидок", type: "save" }
    ]
  },
  {
    ability: "intelligence",
    label: "ІНТЕЛЕКТ",
    skills: [
      { key: "intelligenceCheck", label: "Перевірка", type: "check" },
      { key: "intelligenceSave", label: "Рят. кидок", type: "save" },
      { key: "investigation", label: "Аналіз", type: "skill" },
      { key: "history", label: "Історія", type: "skill" },
      { key: "hacking", label: "Хакінг", type: "skill" },
      { key: "streetwise", label: "Природа(міста)", type: "skill" },
      { key: "religion", label: "Релігія", type: "skill" }
    ]
  },
  {
    ability: "reaction",
    label: "РЕАКЦІЯ",
    skills: [
      { key: "reactionCheck", label: "Перевірка", type: "check" },
      { key: "reactionSave", label: "Рят. кидок", type: "save" },
      { key: "perception", label: "Сприйняття", type: "skill" },
      { key: "survival", label: "Виживання(у місті)", type: "skill" },
      { key: "medicine", label: "Медицина", type: "skill" },
      { key: "insight", label: "Проникливість", type: "skill" },
      { key: "driving", label: "Управління машиною", type: "skill" }
    ]
  },
  {
    ability: "charisma",
    label: "ХАРИЗМА",
    skills: [
      { key: "charismaCheck", label: "Перевірка", type: "check" },
      { key: "charismaSave", label: "Рят. кидок", type: "save" },
      { key: "performance", label: "Виступ", type: "skill" },
      { key: "intimidation", label: "Залякування", type: "skill" },
      { key: "deception", label: "Обман", type: "skill" },
      { key: "persuasion", label: "Переконання", type: "skill" }
    ]
  }
];

const statusEffects = [
  "-",
  "Несвідомий",
  "Психозлам",
  "Оптичне маскування",
  "Система не відповідає",
  "Аудіочіп вимкнено",
  "Цифрова ізоляція",
  "Плутанина сигналів",
  "Оптика засліплена",
  "Нейротоксин",
  "Взлом",
  "Сенсорна перевантаженість",
  "Нервовий параліч",
  "Системна втрата рівноваги",
  "Захоплення нейролінку"
];

const statusDescriptions: { [key: string]: string } = {
  "Несвідомий": "Ви отримуєте стан «Недієздатний» і «Скинутий» (на землі), кидаєте все, що тримали. Швидкість 0, автоматично провалюєте рятунки Сили й Спритності. Усі атаки впритул — критичні. Ви не усвідомлюєте оточення.",
  "Психозлам": "Ви маєте заваду на атаки та перевірки, поки бачите джерело страху, і не можете добровільно наближатися до нього.",
  "Оптичне маскування": "Ви отримуєте перевагу на ініціативу. Вас не видно, якщо противник не має спеціальних сенсорів. Усі атаки по вас — із завадою, ваші атаки — з перевагою, поки вас не виявлять.",
  "Система не відповідає": "Ви не можете використовувати дії або реакції, втрачаєте концентрацію, мову, і маєте заваду на ініціативу.",
  "Аудіочіп вимкнено": "Ви нічого не чуєте і провалюєте всі перевірки, пов’язані зі слухом.",
  "Цифрова ізоляція": "Ви перетворені в неживу матерію (як камінь або метал). Вага збільшується в 10 разів. Швидкість 0. Автоматичні провали рятунків Сили й Спритності. Стійкість до всього урону, імунітет до отруєння.",
  "Плутанина сигналів": "Швидкість 0. Перевага до атак по вас, заваду на ваші атаки. Ви маєте заваду на рятунки Спритності.",
  "Оптика засліплена": "Ви нічого не бачите, автоматично провалюєте перевірки, пов’язані із зором. По вас — перевага, від вас — завада.",
  "Нейротоксин": "Ви маєте заваду на всі перевірки характеристик і атаки.",
  "Взлом": "Ви не можете атакувати того, хто вас зламав, або навмисне йому шкодити. Він має перевагу в соціальних взаємодіях з вами.",
  "Сенсорна перевантаженість": "Ви недієздатні, швидкість 0, автоматично провалюєте рятунки Сили й Спритності, по вас — перевага на атаки.",
  "Нервовий параліч": "Ви недієздатні, швидкість 0, автоматично провалюєте рятунки Сили й Спритності. Якщо ворог поруч — усі його влучання стають критами.",
  "Системна втрата рівноваги": "Ви лежите на землі, можете пересуватися лише повзком. Щоб встати — витрачаєте половину швидкості. По вас (у ближньому бою) — перевага, від вас — завада.",
  "Захоплення нейролінку": "Ваша швидкість 0, ви не можете її збільшити. Якщо вас тягнуть — переміщення кривдника уповільнюється вдвічі."
};

const hitDieTypes = ["d4", "d6", "d8", "d10", "d12"];

const getModifier = (score: number): number => Math.floor((score - 10) / 2);

const getStored = <T,>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const CharacterSheet: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>(() =>
    getStored("stats", {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      reaction: 10,
      charisma: 10,
    })
  );
  const [skills, setSkills] = useState<Skills>(() =>
    getStored("skills", {
      strengthCheck: 0,
      strengthSave: 0,
      athletics: 0,
      dexterityCheck: 0,
      dexteritySave: 0,
      acrobatics: 0,
      sleightOfHand: 0,
      stealth: 0,
      constitutionCheck: 0,
      constitutionSave: 0,
      intelligenceCheck: 0,
      intelligenceSave: 0,
      investigation: 0,
      history: 0,
      hacking: 0,
      streetwise: 0,
      religion: 0,
      reactionCheck: 0,
      reactionSave: 0,
      perception: 0,
      survival: 0,
      medicine: 0,
      insight: 0,
      driving: 0,
      charismaCheck: 0,
      charismaSave: 0,
      performance: 0,
      intimidation: 0,
      deception: 0,
      persuasion: 0,
    })
  );
  const [humanity, setHumanity] = useState(() => getStored("humanity", { max: "", current: "" }));
  const [hp, setHp] = useState(() => getStored("hp", { max: "", current: "" }));
  const [tempHp, setTempHp] = useState(() => getStored("tempHp", ""));
  const [exhaustion, setExhaustion] = useState(() => getStored("exhaustion", 0));
  const [status, setStatus] = useState(() => getStored("status", "-"));
  const [money, setMoney] = useState(() => getStored("money", ""));
  const [name, setName] = useState(() => getStored("name", ""));
  const [role, setRole] = useState(() => getStored("role", "Корпорат"));
  const [level, setLevel] = useState(() => getStored("level", 1));
  const [image, setImage] = useState(() => getStored("image", ""));
  const [armor, setArmor] = useState(() => getStored("armor", ""));
  const [speed, setSpeed] = useState(() => getStored("speed", ""));
  const [proficiencyBonus, setProficiencyBonus] = useState(() => getStored("proficiencyBonus", 2));
  const [hitDieType, setHitDieType] = useState(() => getStored("hitDieType", "d8"));
  const [hitDiceUsed, setHitDiceUsed] = useState(() => getStored("hitDiceUsed", 0));
  const [hitDiceToSpend, setHitDiceToSpend] = useState("");
  const [hpChange, setHpChange] = useState("");
  const [moneyChange, setMoneyChange] = useState("");
  const [tempHpChange, setTempHpChange] = useState("");
  const [heroicInspiration, setHeroicInspiration] = useState(() => getStored("heroicInspiration", false));
  const [deathSaves, setDeathSaves] = useState(() => getStored("deathSaves", { successes: [false, false, false], failures: [false, false, false] }));
  const [isDeathSavesActive, setIsDeathSavesActive] = useState(() => parseInt(getStored("hp", { max: "", current: "" }).current) === 0);
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const statusSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    localStorage.setItem("stats", JSON.stringify(stats));
    localStorage.setItem("skills", JSON.stringify(skills));
    localStorage.setItem("humanity", JSON.stringify(humanity));
    localStorage.setItem("hp", JSON.stringify(hp));
    localStorage.setItem("tempHp", JSON.stringify(tempHp));
    localStorage.setItem("exhaustion", JSON.stringify(exhaustion));
    localStorage.setItem("status", JSON.stringify(status));
    localStorage.setItem("money", JSON.stringify(money));
    localStorage.setItem("name", JSON.stringify(name));
    localStorage.setItem("role", JSON.stringify(role));
    localStorage.setItem("level", JSON.stringify(level));
    localStorage.setItem("image", JSON.stringify(image));
    localStorage.setItem("armor", JSON.stringify(armor));
    localStorage.setItem("speed", JSON.stringify(speed));
    localStorage.setItem("proficiencyBonus", JSON.stringify(proficiencyBonus));
    localStorage.setItem("hitDieType", JSON.stringify(hitDieType));
    localStorage.setItem("hitDiceUsed", JSON.stringify(hitDiceUsed));
    localStorage.setItem("heroicInspiration", JSON.stringify(heroicInspiration));
    localStorage.setItem("deathSaves", JSON.stringify(deathSaves));
  }, [stats, skills, humanity, hp, tempHp, exhaustion, status, money, name, role, level, image, armor, speed, proficiencyBonus, hitDieType, hitDiceUsed, heroicInspiration, deathSaves]);

  useEffect(() => {
    const currentHp = parseInt(hp.current) || 0;
    if (currentHp === 0) {
      setIsDeathSavesActive(true);
    }
  }, [hp.current]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusSelectRef.current && !statusSelectRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleStatChange = (key: keyof Stats, value: string) => {
    const intValue = Math.min(30, Math.max(0, parseInt(value) || 0));
    setStats((prev: Stats) => ({ ...prev, [key]: intValue }));
  };

  const handleLevelChange = (value: string) => {
    const intValue = Math.min(20, Math.max(0, parseInt(value) || 0));
    setLevel(intValue);
    setHitDiceUsed(prev => Math.min(prev, intValue));
  };

  const handleArmorChange = (value: string) => {
    const intValue = parseInt(value) || 0;
    setArmor(intValue.toString());
  };

  const handleSpeedChange = (value: string) => {
    const intValue = parseInt(value) || 0;
    setSpeed(intValue.toString());
  };

  const handleHumanityChange = (field: "max" | "current", value: string) => {
    const intValue = parseInt(value) || 0;
    setHumanity(prev => ({ ...prev, [field]: intValue.toString() }));
  };

  const handleHpChange = (field: "max" | "current", value: string) => {
    const intValue = parseInt(value) || 0;
    setHp(prev => ({ ...prev, [field]: intValue.toString() }));
  };

  const handleTempHpChange = (value: string) => {
    const intValue = Math.max(0, parseInt(value) || 0);
    setTempHp(intValue.toString());
  };

  const handleExhaustionChange = (value: string) => {
    const intValue = Math.min(6, Math.max(0, parseInt(value) || 0));
    setExhaustion(intValue);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setIsStatusDropdownOpen(true);
  };

  const handleMoneyChange = (value: string) => {
    const intValue = parseInt(value) || 0;
    setMoney(intValue.toString());
  };

  const handleHitDieTypeChange = (value: string) => {
    setHitDieType(value);
  };

  const handleHitDiceToSpendChange = (value: string) => {
    const intValue = parseInt(value) || 0;
    setHitDiceToSpend(intValue.toString());
  };

  const handleHpModificationChange = (value: string) => {
    const intValue = parseInt(value) || 0;
    setHpChange(intValue.toString());
  };

  const handleMoneyModificationChange = (value: string) => {
    const intValue = parseInt(value) || 0;
    setMoneyChange(intValue.toString());
  };

  const handleTempHpModificationChange = (value: string) => {
    const intValue = parseInt(value) || 0;
    setTempHpChange(intValue.toString());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (fileInput) fileInput.value = "";
    }
  };

  const handleAvatarClick = () => {
    if (fileInput) fileInput.click();
  };

  const handleRemoveImage = () => {
    setImage("");
  };

  const handleBackpackClick = () => {
    navigate("/backpack");
  };

  const handleNotesClick = () => {
    navigate("/notes");
  };

  const toggleSkillProficiency = (skillKey: keyof Skills, skillType: SkillType) => {
    if (skillType === "check") return;
    
    setSkills(prev => {
      const current = prev[skillKey];
      let next: SkillProficiency | RegularSkillProficiency;
      
      if (skillType === "save") {
        next = (current === 0 ? 1 : 0) as SkillProficiency;
      } else {
        next = ((current + 1) % 3) as RegularSkillProficiency;
      }
      
      return { ...prev, [skillKey]: next };
    });
  };

  const calculateSkillBonus = (
    ability: keyof Stats, 
    skillKey: keyof Skills, 
    skillType: SkillType
  ): string => {
    const modifier = getModifier(stats[ability]);
    
    if (skillType === "check") {
      return `${modifier >= 0 ? '+' : ''}${modifier}`;
    }
    
    const proficiency = skills[skillKey];
    const bonus = proficiency * proficiencyBonus;
    const total = modifier + bonus;
    
    return `${total >= 0 ? '+' : ''}${total}`;
  };

  const getProficiencyIcon = (
    proficiency: number, 
    skillType: SkillType
  ): string => {
    if (skillType === "check") return '';
    
    if (skillType === "save") {
      return proficiency === 1 ? '✓' : '○';
    }
    
    switch (proficiency) {
      case 1: return '✓';
      case 2: return '✓✓';
      default: return '○';
    }
  };

  const calculatePassivePerception = () => {
    return stats.reaction;
  };

  const calculatePassiveInsight = () => {
    const insightBonus = calculateSkillBonus("reaction", "insight", "skill");
    return 10 + (parseInt(insightBonus) || 0);
  };

  const calculatePassiveInvestigation = () => {
    const investigationBonus = calculateSkillBonus("intelligence", "investigation", "skill");
    return 10 + (parseInt(investigationBonus) || 0);
  };

  const rollHitDie = (dieType: string): number => {
    const sides = parseInt(dieType.slice(1));
    return Math.floor(Math.random() * sides) + 1;
  };

  const handleShortRest = () => {
    const diceToSpend = parseInt(hitDiceToSpend) || 0;
    const availableDice = level - hitDiceUsed;
    if (diceToSpend <= 0 || diceToSpend > availableDice) {
      alert(`Ви можете використати від 1 до ${availableDice} костей хітів.`);
      return;
    }

    const conModifier = getModifier(stats.constitution);
    let totalHealing = 0;
    for (let i = 0; i < diceToSpend; i++) {
      totalHealing += rollHitDie(hitDieType) + conModifier;
    }

    const currentHp = parseInt(hp.current) || 0;
    const maxHp = parseInt(hp.max) || 0;
    const newHp = Math.min(currentHp + totalHealing, maxHp);

    setHp(prev => ({ ...prev, current: newHp.toString() }));
    setTempHp("0");
    setHitDiceUsed(prev => prev + diceToSpend);
    setHitDiceToSpend("");
    if (newHp > 0) {
      setDeathSaves({ successes: [false, false, false], failures: [false, false, false] });
      setIsDeathSavesActive(false);
    }
  };

  const handleLongRest = () => {
    setHp(prev => ({ ...prev, current: prev.max }));
    setTempHp("0");
    setHitDiceUsed(0);
    setDeathSaves({ successes: [false, false, false], failures: [false, false, false] });
    setIsDeathSavesActive(false);
  };

  const handleHpModification = (isHealing: boolean) => {
    const changeAmount = parseInt(hpChange) || 0;
    if (changeAmount <= 0) return;

    const currentHp = parseInt(hp.current) || 0;
    const maxHp = parseInt(hp.max) || 0;
    const currentTempHp = parseInt(tempHp) || 0;
    
    let newHp: number;
    let newTempHp: number;

    if (isHealing) {
      newHp = Math.min(currentHp + changeAmount, maxHp);
      newTempHp = currentTempHp;
    } else {
      if (currentTempHp >= changeAmount) {
        newTempHp = currentTempHp - changeAmount;
        newHp = currentHp;
      } else {
        newTempHp = 0;
        const remainingDamage = changeAmount - currentTempHp;
        newHp = Math.max(currentHp - remainingDamage, 0);
      }
    }
    
    setHp(prev => ({ ...prev, current: newHp.toString() }));
    setTempHp(newTempHp.toString());
    setHpChange("");
    if (newHp > 0) {
      setDeathSaves({ successes: [false, false, false], failures: [false, false, false] });
      setIsDeathSavesActive(false);
    }
  };

  const handleTempHpModification = () => {
    const changeAmount = parseInt(tempHpChange) || 0;
    if (changeAmount <= 0) return;
    
    setTempHp(changeAmount.toString());
    setTempHpChange("");
  };

  const handleMoneyModification = (isAdding: boolean) => {
    const changeAmount = parseInt(moneyChange) || 0;
    if (changeAmount <= 0) return;

    const currentMoney = parseInt(money) || 0;
    
    let newMoney: number;
    if (isAdding) {
      newMoney = currentMoney + changeAmount;
    } else {
      newMoney = Math.max(currentMoney - changeAmount, 0);
    }
    
    setMoney(newMoney.toString());
    setMoneyChange("");
  };

  const handleDeathSaveChange = (type: 'successes' | 'failures', index: number) => {
    setDeathSaves(prev => {
      const newState = {
        ...prev,
        [type]: [...prev[type]]
      };
      newState[type][index] = !newState[type][index];
      
      const successCount = newState.successes.filter(Boolean).length;
      const failureCount = newState.failures.filter(Boolean).length;

      if (successCount >= 3 || failureCount >= 3) {
        setIsDeathSavesActive(false);
        return { successes: [false, false, false], failures: [false, false, false] };
      }
      
      return newState;
    });
  };

  const formatValue = (value: string): string => {
    const num = parseInt(value) || 0;
    return num.toString();
  };

  const isUnconscious = parseInt(hp.current) === 0;

  return (
    <div className="character-sheet">
      <div className="avatar-container">
        <div className="rest-controls">
          <div className="rest-block">
            <div className="short-rest">
              <label>
                Короткий відпочинок:
                <select
                  value={hitDieType}
                  onChange={e => handleHitDieTypeChange(e.target.value)}
                  className="hit-die-select"
                >
                  {hitDieTypes.map(die => (
                    <option key={die} value={die}>{die}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  max={level - hitDiceUsed}
                  value={formatValue(hitDiceToSpend)}
                  onChange={e => handleHitDiceToSpendChange(e.target.value)}
                  onBlur={e => {
                    const newValue = formatValue(e.target.value);
                    handleHitDiceToSpendChange(newValue);
                  }}
                  placeholder="Кості"
                  className="hit-dice-input"
                />
                <span>({level - hitDiceUsed} залишилось)</span>
              </label>
            </div>
            <div className="rest-buttons">
              <button className="rest-buttons" onClick={handleShortRest}>Короткий</button>
              <button className="rest-buttons" onClick={handleLongRest}>Довгий</button>
            </div>
          </div>
        </div>
        <div className="backpack-container">
          <button onClick={handleBackpackClick} className="backpack-button">
            <ShoppingBagIcon className="backpack-icon" />
            Рюкзак
          </button>
        </div>
        <div className="avatar-frame" onClick={handleAvatarClick}>
          <img
            src={image || defaultImage}
            alt="avatar"
            className="avatar"
          />
          <div className="avatar-glow"></div>
        </div>
        <div className="avatar-controls">
          {image && <button onClick={handleRemoveImage}>Видалити</button>}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            ref={ref => setFileInput(ref)}
            style={{ display: "none" }}
          />
        </div>
      </div>

      <div className="section">
        <div className="input-group">
          <label>
            Ім'я:
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </label>
          <label style={{ marginLeft: 40 }}>
            Роль:
            <select value={role} onChange={e => setRole(e.target.value)}>
              {roles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>
          <label style={{ marginLeft: 40 }}>
            Рівень:
            <input
              type="number"
              min="0"
              max="20"
              value={formatValue(level.toString())}
              onChange={e => handleLevelChange(e.target.value)}
              onBlur={e => {
                const newValue = formatValue(e.target.value);
                handleLevelChange(newValue);
              }}
              style={{ width: 60 }}
            />
          </label>
        </div>
      </div>

      <div className="section">
        <div className="input-group">
          <label>
            Броня:
            <input
              type="number"
              value={formatValue(armor)}
              onChange={e => handleArmorChange(e.target.value)}
              onBlur={e => {
                const newValue = formatValue(e.target.value);
                handleArmorChange(newValue);
              }}
              style={{ width: 60 }}
            />
          </label>
          <label style={{ marginLeft: 40 }}>
            Швидкість:
            <input
              type="number"
              value={formatValue(speed)}
              onChange={e => handleSpeedChange(e.target.value)}
              onBlur={e => {
                const newValue = formatValue(e.target.value);
                handleSpeedChange(newValue);
              }}
              style={{ width: 60 }}
            />
          </label>
          <label style={{ marginLeft: 40 }}>
            <span className="proficiency-bonus">+ </span>
            <input
              type="number"
              value={formatValue(proficiencyBonus.toString())}
              onChange={e => setProficiencyBonus(parseInt(e.target.value) || 0)}
              onBlur={e => {
                const newValue = formatValue(e.target.value);
                setProficiencyBonus(parseInt(newValue) || 0);
              }}
              placeholder="0"
              style={{ width: 60 }}
            />
          </label>
        </div>
      </div>

      <div className="section">
        <div className="humanity-input">
          <label>
            Людяність:
            <div className="dual-input">
              <input
                type="number"
                value={formatValue(humanity.current)}
                onChange={e => handleHumanityChange("current", e.target.value)}
                onBlur={e => {
                  const newValue = formatValue(e.target.value);
                  handleHumanityChange("current", newValue);
                }}
                placeholder="0"
              />
              /
              <input
                type="number"
                value={formatValue(humanity.max)}
                onChange={e => handleHumanityChange("max", e.target.value)}
                onBlur={e => {
                  const newValue = formatValue(e.target.value);
                  handleHumanityChange("max", newValue);
                }}
                placeholder="0"
              />
            </div>
          </label>
        </div>
        <div className="hp-input">
          <label>
            ХП:
            <div className="dual-input">
              <input
                type="number"
                value={formatValue(hp.current)}
                onChange={e => handleHpChange("current", e.target.value)}
                onBlur={e => {
                  const newValue = formatValue(e.target.value);
                  handleHpChange("current", newValue);
                }}
                placeholder="0"
              />
              /
              <input
                type="number"
                value={formatValue(hp.max)}
                onChange={e => handleHpChange("max", e.target.value)}
                onBlur={e => {
                  const newValue = formatValue(e.target.value);
                  handleHpChange("max", newValue);
                }}
                placeholder="0"
              />
            </div>
          </label>
          <div className="hp-modifier">
            <input
              type="number"
              value={formatValue(hpChange)}
              onChange={e => handleHpModificationChange(e.target.value)}
              onBlur={e => {
                const newValue = formatValue(e.target.value);
                handleHpModificationChange(newValue);
              }}
              placeholder="Кількість"
              style={{ width: 80 }}
            />
            <button onClick={() => handleHpModification(false)}>Урон</button>
            <button onClick={() => handleHpModification(true)}>Хіл</button>
          </div>
        </div>
        {isUnconscious && isDeathSavesActive && (
          <div className="death-saves">
            <label>Рятівні кидки від смерті:</label>
            <div className="death-saves-group">
              <div className="death-saves-successes">
                <span>Успіхи:</span>
                {[0, 1, 2].map(index => (
                  <input
                    key={`success-${index}`}
                    type="checkbox"
                    checked={deathSaves.successes[index]}
                    onChange={() => handleDeathSaveChange('successes', index)}
                    className="death-save-checkbox"
                  />
                ))}
              </div>
              <div className="death-saves-failures">
                <span>Провали:</span>
                {[0, 1, 2].map(index => (
                  <input
                    key={`failure-${index}`}
                    type="checkbox"
                    checked={deathSaves.failures[index]}
                    onChange={() => handleDeathSaveChange('failures', index)}
                    className="death-save-checkbox"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="temp-hp-input">
          <label>
            Тимч. ХП:
            <div className="single-input">
              <input
                type="number"
                value={formatValue(tempHp)}
                onChange={e => handleTempHpChange(e.target.value)}
                onBlur={e => {
                  const newValue = formatValue(e.target.value);
                  handleTempHpChange(newValue);
                }}
                placeholder="0"
              />
            </div>
          </label>
          <div className="temp-hp-modifier">
            <input
              type="number"
              value={formatValue(tempHpChange)}
              onChange={e => handleTempHpModificationChange(e.target.value)}
              onBlur={e => {
                const newValue = formatValue(e.target.value);
                handleTempHpModificationChange(newValue);
              }}
              placeholder="Кількість"
              style={{ width: 80 }}
            />
            <button onClick={handleTempHpModification}>Додати</button>
          </div>
        </div>
        <div className="money-input">
          <label>
            Гроші:
            <div className="single-input">
              <input
                type="number"
                value={formatValue(money)}
                onChange={e => handleMoneyChange(e.target.value)}
                onBlur={e => {
                  const newValue = formatValue(e.target.value);
                  handleMoneyChange(newValue);
                }}
                placeholder="0"
              />
              <span className="currency-symbol">€$</span>
            </div>
          </label>
          <div className="money-modifier">
            <input
              type="number"
              value={formatValue(moneyChange)}
              onChange={e => handleMoneyModificationChange(e.target.value)}
              onBlur={e => {
                const newValue = formatValue(e.target.value);
                handleMoneyModificationChange(newValue);
              }}
              placeholder="Кількість"
              style={{ width: 80 }}
            />
            <button onClick={() => handleMoneyModification(false)}>Відняти</button>
            <button onClick={() => handleMoneyModification(true)}>Додати</button>
          </div>
        </div>
        <div className="status-effects-group">
          <div className="status-input relative">
            <label>
              Статус:
              <select
                ref={statusSelectRef}
                value={status}
                onChange={e => handleStatusChange(e.target.value)}
                onFocus={() => setIsStatusDropdownOpen(true)}
              >
                {statusEffects.map(effect => (
                  <option key={effect} value={effect}>{effect}</option>
                ))}
              </select>
            </label>
            {isStatusDropdownOpen && status !== "-" && (
              <div className="status-dropdown">
                <div className="status-dropdown-header">
                  <h4>{status}</h4>
                  <button
                    onClick={() => setIsStatusDropdownOpen(false)}
                    className="status-dropdown-close"
                  >
                    ×
                  </button>
                </div>
                <p>{statusDescriptions[status]}</p>
              </div>
            )}
          </div>
          <div className="exhaustion-input">
            <label>
              Виснаження:
              <select value={exhaustion} onChange={e => handleExhaustionChange(e.target.value)}>
                {[0, 1, 2, 3, 4, 5, 6].map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="heroic-inspiration">
            <label>
              Героїчне Натхнення:
              <input
                type="checkbox"
                checked={heroicInspiration}
                onChange={e => setHeroicInspiration(e.target.checked)}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Характеристики</h3>
        <div className="abilities-grid">
          {abilities.map(({ key, label }) => (
            <div key={key} className="ability">
              <div>{label}</div>
              <input
                type="number"
                min="0"
                max="30"
                value={formatValue(stats[key].toString())}
                onChange={e => handleStatChange(key, e.target.value)}
                onBlur={e => {
                  const newValue = formatValue(e.target.value);
                  handleStatChange(key, newValue);
                }}
              />
              <div className="ability-modifier">
                {getModifier(stats[key]) >= 0 ? "+" : ""}
                {getModifier(stats[key])}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Навички</h3>
        <div className="skills-container">
          {skillGroups.map(group => (
            <div key={group.ability} className="skill-group">
              <h4 className="skill-group-title">{group.label}</h4>
              <div className="skills-grid">
                {group.skills.map(skill => (
                  <div 
                    key={skill.key}
                    onClick={() => toggleSkillProficiency(skill.key, skill.type)}
                    className={`skill ${skill.type === "check" ? "skill-check" : ""}`}
                  >
                    <div className="skill-name">{skill.label}</div>
                    <div className="skill-bonus">
                      {calculateSkillBonus(
                        group.ability, 
                        skill.key, 
                        skill.type
                      )}
                    </div>
                    <div className="skill-proficiency">
                      {getProficiencyIcon(
                        skills[skill.key],
                        skill.type
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <h3 className="section-title">Пасивні Навички</h3>
        <div className="passive-skills">
          <div className="passive-skill">
            <div className="passive-skill-name">Пас. Сприйняття</div>
            <div className="passive-skill-value">{calculatePassivePerception()}</div>
            <div className="passive-skill-details">Реакція: {stats.reaction}</div>
          </div>
          <div className="passive-skill">
            <div className="passive-skill-name">Пас. Проникливість</div>
            <div className="passive-skill-value">{calculatePassiveInsight()}</div>
            <div className="passive-skill-details">
              Бонус: {calculateSkillBonus("reaction", "insight", "skill")}
            </div>
          </div>
          <div className="passive-skill">
            <div className="passive-skill-name">Пас. Аналіз</div>
            <div className="passive-skill-value">{calculatePassiveInvestigation()}</div>
            <div className="passive-skill-details">
              Бонус: {calculateSkillBonus("intelligence", "investigation", "skill")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;