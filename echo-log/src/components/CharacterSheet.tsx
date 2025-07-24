import "./CharacterSheet.css";
import React, { useEffect, useState } from "react";

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

const getModifier = (score: number): number => Math.floor((score - 10) / 2);

const getStored = <T,>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const CharacterSheet: React.FC = () => {
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
  const [name, setName] = useState(() => getStored("name", ""));
  const [role, setRole] = useState(() => getStored("role", "Корпорат"));
  const [level, setLevel] = useState(() => getStored("level", 1));
  const [image, setImage] = useState(() => getStored("image", ""));
  const [armor, setArmor] = useState(() => getStored("armor", ""));
  const [speed, setSpeed] = useState(() => getStored("speed", ""));
  const [proficiencyBonus, setProficiencyBonus] = useState(() => getStored("proficiencyBonus", 2));
  const [hpChange, setHpChange] = useState("");
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem("stats", JSON.stringify(stats));
    localStorage.setItem("skills", JSON.stringify(skills));
    localStorage.setItem("humanity", JSON.stringify(humanity));
    localStorage.setItem("hp", JSON.stringify(hp));
    localStorage.setItem("name", JSON.stringify(name));
    localStorage.setItem("role", JSON.stringify(role));
    localStorage.setItem("level", JSON.stringify(level));
    localStorage.setItem("image", JSON.stringify(image));
    localStorage.setItem("armor", JSON.stringify(armor));
    localStorage.setItem("speed", JSON.stringify(speed));
    localStorage.setItem("proficiencyBonus", JSON.stringify(proficiencyBonus));
  }, [stats, skills, humanity, hp, name, role, level, image, armor, speed, proficiencyBonus]);

  const handleStatChange = (key: keyof Stats, value: string) => {
    const intValue = Math.min(30, Math.max(0, parseInt(value) || 0));
    setStats((prev: Stats) => ({ ...prev, [key]: intValue }));
  };

  const handleLevelChange = (value: string) => {
    const intValue = Math.min(20, Math.max(0, parseInt(value) || 0)); // Enforce max 20
    setLevel(intValue);
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

  const handleHpModificationChange = (value: string) => {
    const intValue = parseInt(value) || 0;
    setHpChange(intValue.toString());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (fileInput) fileInput.value = ""; // Reset file input
    }
  };

  const handleAvatarClick = () => {
    if (fileInput) fileInput.click();
  };

  const handleRemoveImage = () => {
    setImage("");
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

  const handleHpModification = (isHealing: boolean) => {
    const changeAmount = parseInt(hpChange) || 0;
    if (changeAmount <= 0) return;

    const currentHp = parseInt(hp.current) || 0;
    const maxHp = parseInt(hp.max) || 0;
    
    let newHp: number;
    if (isHealing) {
      newHp = Math.min(currentHp + changeAmount, maxHp);
    } else {
      newHp = Math.max(currentHp - changeAmount, 0);
    }
    
    setHp(prev => ({ ...prev, current: newHp.toString() }));
    setHpChange("");
  };

  const formatValue = (value: string): string => {
    const num = parseInt(value) || 0;
    return num.toString(); // Removes leading zeros
  };

  return (
    <div className="character-sheet">
      <div className="avatar-container">
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
            style={{ display: "none" }} // Hidden file input
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
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
            >
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
              max="20" // Enforce max level of 20
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