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

type SkillProficiency = 0 | 1; // 0 - not proficient, 1 - proficient (only for saving throws)
type RegularSkillProficiency = 0 | 1 | 2; // 0 - none, 1 - proficient, 2 - expert

type Skills = {
  // Strength
  strengthCheck: 0; // Always 0 - cannot be changed
  strengthSave: SkillProficiency;
  athletics: RegularSkillProficiency;
  
  // Dexterity
  dexterityCheck: 0;
  dexteritySave: SkillProficiency;
  acrobatics: RegularSkillProficiency;
  sleightOfHand: RegularSkillProficiency;
  stealth: RegularSkillProficiency;
  
  // Constitution
  constitutionCheck: 0;
  constitutionSave: SkillProficiency;
  
  // Intelligence
  intelligenceCheck: 0;
  intelligenceSave: SkillProficiency;
  investigation: RegularSkillProficiency;
  history: RegularSkillProficiency;
  hacking: RegularSkillProficiency;
  streetwise: RegularSkillProficiency;
  religion: RegularSkillProficiency;
  
  // Reaction
  reactionCheck: 0;
  reactionSave: SkillProficiency;
  perception: RegularSkillProficiency;
  survival: RegularSkillProficiency;
  medicine: RegularSkillProficiency;
  insight: RegularSkillProficiency;
  driving: RegularSkillProficiency;
  
  // Charisma
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
    getStored<Stats>("stats", {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      reaction: 10,
      charisma: 10,
    })
  );

  const [skills, setSkills] = useState<Skills>(() =>
    getStored<Skills>("skills", {
      // Strength
      strengthCheck: 0,
      strengthSave: 0,
      athletics: 0,
      
      // Dexterity
      dexterityCheck: 0,
      dexteritySave: 0,
      acrobatics: 0,
      sleightOfHand: 0,
      stealth: 0,
      
      // Constitution
      constitutionCheck: 0,
      constitutionSave: 0,
      
      // Intelligence
      intelligenceCheck: 0,
      intelligenceSave: 0,
      investigation: 0,
      history: 0,
      hacking: 0,
      streetwise: 0,
      religion: 0,
      
      // Reaction
      reactionCheck: 0,
      reactionSave: 0,
      perception: 0,
      survival: 0,
      medicine: 0,
      insight: 0,
      driving: 0,
      
      // Charisma
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
    const intValue = parseInt(value) || 0;
    setStats((prev: Stats) => ({ ...prev, [key]: intValue }));
  };

  const handleDualInputChange = (
    type: "humanity" | "hp",
    field: "max" | "current",
    value: string
  ) => {
    const setter = type === "humanity" ? setHumanity : setHp;
    const state = type === "humanity" ? humanity : hp;
    setter({ ...state, [field]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage("");
  };

  const toggleSkillProficiency = (skillKey: keyof Skills, skillType: "check" | "save" | "skill") => {
    if (skillType === "check") return; // Checks cannot be modified
    
    setSkills(prev => {
      const current = prev[skillKey];
      let next: SkillProficiency | RegularSkillProficiency;
      
      if (skillType === "save") {
        // For saving throws, toggle between 0 and 1
        next = (current === 0 ? 1 : 0) as SkillProficiency;
      } else {
        // For regular skills, cycle through 0, 1, 2
        next = ((current + 1) % 3) as RegularSkillProficiency;
      }
      
      return { ...prev, [skillKey]: next };
    });
  };

  const calculateSkillBonus = (
    ability: keyof Stats, 
    skillKey: keyof Skills, 
    skillType: "check" | "save" | "skill"
  ): string => {
    const modifier = getModifier(stats[ability]);
    
    if (skillType === "check") {
      // Checks always use just the ability modifier
      return `${modifier >= 0 ? '+' : ''}${modifier}`;
    }
    
    const proficiency = skills[skillKey];
    const bonus = proficiency * proficiencyBonus;
    const total = modifier + bonus;
    
    return `${total >= 0 ? '+' : ''}${total}`;
  };

  const getProficiencyIcon = (
    proficiency: number, 
    skillType: "check" | "save" | "skill"
  ): string => {
    if (skillType === "check") return ''; // No icon for checks
    
    if (skillType === "save") {
      return proficiency === 1 ? '✓' : '○';
    }
    
    // For regular skills
    switch (proficiency) {
      case 1: return '✓';
      case 2: return '✓✓';
      default: return '○';
    }
  };

  // Calculate passive skills
  const calculatePassivePerception = () => {
    return stats.reaction; // Passive Perception equals Reaction score
  };

  const calculatePassiveInsight = () => {
    const insightBonus = calculateSkillBonus("reaction", "insight", "skill");
    return 10 + parseInt(insightBonus) || 10;
  };

  const calculatePassiveInvestigation = () => {
    const investigationBonus = calculateSkillBonus("intelligence", "investigation", "skill");
    return 10 + parseInt(investigationBonus) || 10;
  };

  return (
    <div className="character-sheet">
      <div className="avatar-container">
        <img
          src={image || defaultImage}
          alt="avatar"
          className="avatar"
        />
        <div className="avatar-controls">
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {image && <button onClick={handleRemoveImage}>Видалити</button>}
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
              min={1}
              max={20}
              value={level}
              onChange={e => setLevel(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
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
              type="text"
              value={armor}
              onChange={e => setArmor(e.target.value)}
              style={{ width: 60 }}
            />
          </label>
          <label style={{ marginLeft: 40 }}>
            Швидкість:
            <input
              type="text"
              value={speed}
              onChange={e => setSpeed(e.target.value)}
              style={{ width: 60 }}
            />
          </label>
          <label style={{ marginLeft: 40 }}>
            <span className="proficiency-bonus">+ </span>
            <input
              type="number"
              value={proficiencyBonus}
              onChange={e => setProficiencyBonus(parseInt(e.target.value) || 0)}
              placeholder="Бонус майстерності"
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
                type="text"
                value={humanity.current}
                onChange={e => handleDualInputChange("humanity", "current", e.target.value)}
                placeholder="Поточна"
              />
              /
              <input
                type="text"
                value={humanity.max}
                onChange={e => handleDualInputChange("humanity", "max", e.target.value)}
                placeholder="Макс."
              />
            </div>
          </label>
        </div>
        <div className="hp-input">
          <label>
            ХП:
            <div className="dual-input">
              <input
                type="text"
                value={hp.current}
                onChange={e => handleDualInputChange("hp", "current", e.target.value)}
                placeholder="Поточні"
              />
              /
              <input
                type="text"
                value={hp.max}
                onChange={e => handleDualInputChange("hp", "max", e.target.value)}
                placeholder="Макс."
              />
            </div>
          </label>
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
                value={stats[key]}
                onChange={e => handleStatChange(key, e.target.value)}
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
                    onClick={() => skill.type !== "check" && toggleSkillProficiency(skill.key as keyof Skills, skill.type)}
                    className={`skill ${skill.type === "check" ? "skill-check" : ""}`}
                  >
                    <div className="skill-name">{skill.label}</div>
                    <div className="skill-bonus">
                      {calculateSkillBonus(
                        group.ability as keyof Stats, 
                        skill.key as keyof Skills, 
                        skill.type
                      )}
                    </div>
                    <div className="skill-proficiency">
                      {getProficiencyIcon(
                        skills[skill.key as keyof Skills], 
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