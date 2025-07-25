import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Other.css';

interface Spell {
  id: string;
  name: string;
  level: number;
  damage?: string;
  description: string;
  type: 'damage' | 'heal' | 'none';
  bonusStat?: string;
  hitBonus?: number;
}

interface Equipment {
  id: string;
  name: string;
  quantity: number;
  description: string;
}

interface SpecialEquipment {
  id: string;
  name: string;
  quantity: number;
  description: string;
  usageType?: 'Long Rest' | 'Short Rest' | 'None';
  hasType?: boolean;
  type?: 'damage' | 'heal';
  damage?: string;
  hitBonus?: number;
  bonusStat?: string;
}

interface Firearm {
  id: string;
  name: string;
  damage: string;
  hitBonus: number;
  description: string;
  hasAmmo: boolean;
  ammo: number;
  bonusStat?: string;
}

interface Implant {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface SpellSlot {
  level: number;
  total: number;
  used: number[];
}

interface CharacterData {
  spells: Spell[];
  equipment: Equipment[];
  specialEquipment: SpecialEquipment[];
  firearms: Firearm[];
  implants: Implant[];
  spellSlots: SpellSlot[];
}

const defaultCharacterData: CharacterData = {
  spells: [],
  equipment: [],
  specialEquipment: [],
  firearms: [],
  implants: [],
  spellSlots: Array.from({ length: 9 }, (_, i) => ({
    level: i + 1,
    total: 0,
    used: [],
  })),
};

export const Other = () => {
  const navigate = useNavigate();
  const [characterData, setCharacterData] = useState<CharacterData>(() => {
    try {
      const saved = localStorage.getItem('characterData');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (isValidCharacterData(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error parsing localStorage characterData:', error);
    }
    return defaultCharacterData;
  });
  const [newSpell, setNewSpell] = useState({
    name: '',
    level: 0,
    damage: '',
    description: '',
    type: 'none' as 'damage' | 'heal' | 'none',
    bonusStat: '',
    hitBonus: 0,
  });
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    quantity: 0,
    description: '',
  });
  const [newSpecialEquipment, setNewSpecialEquipment] = useState({
    name: '',
    quantity: 0,
    description: '',
    usageType: 'None' as 'Long Rest' | 'Short Rest' | 'None',
    hasType: false,
    type: 'damage' as 'damage' | 'heal',
    damage: '',
    hitBonus: 0,
    bonusStat: '',
  });
  const [newFirearm, setNewFirearm] = useState({
    name: '',
    damage: '',
    hitBonus: 0,
    description: '',
    hasAmmo: false,
    ammo: 0,
    bonusStat: '',
  });
  const [newImplant, setNewImplant] = useState({
    name: '',
    description: '',
    category: 'Frontal Lobe',
  });
  const jsonFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    localStorage.setItem('characterData', JSON.stringify(characterData));
  }, [characterData]);

  const updateCharacterData = (updates: Partial<CharacterData>) => {
    setCharacterData(prev => ({ ...prev, ...updates }));
  };

  const formatNumber = (num: number | string): string => {
    const numericValue = Number(num);
    return numericValue.toString().replace(/^0+/, '') || '0';
  };

  const implantLimits: { [key: string]: number } = {
    'Frontal Lobe': 3,
    'Arms': 1,
    'Skeleton': 3,
    'Nervous System': 3,
    'Skin': 3,
    'Operating System': 1,
    'Face': 1,
    'Palms': 2,
    'Circulatory System': 3,
    'Legs': 1,
  };

  const statOptions = [
    '',
    'Strength',
    'Dexterity',
    'Constitution',
    'Intelligence',
    'Reaction',
    'Charisma',
  ];

  const handleSpellInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewSpell((prev) => ({
      ...prev,
      [name]: name === 'hitBonus' ? Number(formatNumber(value)) :
             name === 'level' ? Number(value) : value,
      ...(name === 'type' && value === 'none' ? { damage: '', bonusStat: '', hitBonus: 0 } : {}),
      ...(name === 'bonusStat' && !value ? { hitBonus: 0 } : {}),
    }));
  };

  const handleAddSpell = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpell.name && newSpell.description && (newSpell.type !== 'none' ? newSpell.damage : true)) {
      const spell: Spell = {
        id: crypto.randomUUID(),
        name: newSpell.name,
        level: Number(newSpell.level),
        damage: newSpell.type !== 'none' ? newSpell.damage : undefined,
        description: newSpell.description,
        type: newSpell.type,
        bonusStat: newSpell.bonusStat || undefined,
        hitBonus: newSpell.bonusStat ? Number(newSpell.hitBonus) : undefined,
      };
      updateCharacterData({ spells: [...characterData.spells, spell] });
      setNewSpell({ name: '', level: 0, damage: '', description: '', type: 'none', bonusStat: '', hitBonus: 0 });
    }
  };

  const handleDeleteSpell = (id: string) => {
    updateCharacterData({
      spells: characterData.spells.filter((spell) => spell.id !== id),
    });
  };

  const handleEquipmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewEquipment((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(formatNumber(value)) : value,
    }));
  };

  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEquipment.name && newEquipment.description) {
      const equip: Equipment = {
        id: crypto.randomUUID(),
        name: newEquipment.name,
        quantity: Number(newEquipment.quantity),
        description: newEquipment.description,
      };
      updateCharacterData({ equipment: [...characterData.equipment, equip] });
      setNewEquipment({ name: '', quantity: 0, description: '' });
    }
  };

  const handleSpecialEquipmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setNewSpecialEquipment((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
             name === 'quantity' || name === 'hitBonus' ? Number(formatNumber(value)) : value,
      ...(name === 'hasType' && !(e.target as HTMLInputElement).checked ? { type: 'damage', damage: '', hitBonus: 0, bonusStat: '' } : {}),
      ...(name === 'bonusStat' && !value ? { hitBonus: 0 } : {}),
    }));
  };

  const handleAddSpecialEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpecialEquipment.name && newSpecialEquipment.description) {
      const equip: SpecialEquipment = {
        id: crypto.randomUUID(),
        name: newSpecialEquipment.name,
        quantity: Number(newSpecialEquipment.quantity),
        description: newSpecialEquipment.description,
        usageType: newSpecialEquipment.usageType,
        hasType: newSpecialEquipment.hasType,
        type: newSpecialEquipment.hasType ? newSpecialEquipment.type : undefined,
        damage: newSpecialEquipment.hasType ? newSpecialEquipment.damage : undefined,
        hitBonus: newSpecialEquipment.hasType && newSpecialEquipment.bonusStat ? Number(newSpecialEquipment.hitBonus) : undefined,
        bonusStat: newSpecialEquipment.hasType && newSpecialEquipment.bonusStat ? newSpecialEquipment.bonusStat : undefined,
      };
      updateCharacterData({
        specialEquipment: [...characterData.specialEquipment, equip],
      });
      setNewSpecialEquipment({
        name: '',
        quantity: 0,
        description: '',
        usageType: 'None',
        hasType: false,
        type: 'damage',
        damage: '',
        hitBonus: 0,
        bonusStat: '',
      });
    }
  };

  const handleDeleteEquipment = (id: string) => {
    updateCharacterData({
      equipment: characterData.equipment.filter((equip) => equip.id !== id),
    });
  };

  const handleDeleteSpecialEquipment = (id: string) => {
    updateCharacterData({
      specialEquipment: characterData.specialEquipment.filter((equip) => equip.id !== id),
    });
  };

  const handleQuantityChange = (id: string, change: number, isSpecial: boolean) => {
    const key = isSpecial ? 'specialEquipment' : 'equipment';
    updateCharacterData({
      [key]: characterData[key].map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item,
      ),
    });
  };

  const handleFirearmInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setNewFirearm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
             name === 'ammo' || name === 'hitBonus' ? Number(formatNumber(value)) : value,
      ...(name === 'hasAmmo' && !(e.target as HTMLInputElement).checked ? { ammo: 0 } : {}),
    }));
  };

  const handleAddFirearm = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFirearm.name && newFirearm.damage && newFirearm.description) {
      const firearm: Firearm = {
        id: crypto.randomUUID(),
        name: newFirearm.name,
        damage: newFirearm.damage,
        hitBonus: Number(newFirearm.hitBonus),
        description: newFirearm.description,
        hasAmmo: newFirearm.hasAmmo,
        ammo: newFirearm.hasAmmo ? Number(newFirearm.ammo) : 0,
        bonusStat: newFirearm.bonusStat || undefined,
      };
      updateCharacterData({ firearms: [...characterData.firearms, firearm] });
      setNewFirearm({ name: '', damage: '', hitBonus: 0, description: '', hasAmmo: false, ammo: 0, bonusStat: '' });
    }
  };

  const handleDeleteFirearm = (id: string) => {
    updateCharacterData({
      firearms: characterData.firearms.filter((firearm) => firearm.id !== id),
    });
  };

  const handleImplantInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewImplant((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImplant = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCount = characterData.implants.filter((implant) => implant.category === newImplant.category).length;
    if (currentCount >= implantLimits[newImplant.category]) {
      alert(`Maximum number of implants reached for category "${newImplant.category}" (${implantLimits[newImplant.category]}).`);
      return;
    }
    if (newImplant.name && newImplant.description) {
      const implant: Implant = {
        id: crypto.randomUUID(),
        name: newImplant.name,
        description: newImplant.description,
        category: newImplant.category,
      };
      updateCharacterData({ implants: [...characterData.implants, implant] });
      setNewImplant({ name: '', description: '', category: 'Frontal Lobe' });
    }
  };

  const handleDeleteImplant = (id: string) => {
    updateCharacterData({
      implants: characterData.implants.filter((implant) => implant.id !== id),
    });
  };

  const handleAmmoChange = (id: string, change: number) => {
    updateCharacterData({
      firearms: characterData.firearms.map((firearm) =>
        firearm.id === id && firearm.hasAmmo
          ? { ...firearm, ammo: Math.max(0, firearm.ammo + change) }
          : firearm,
      ),
    });
  };

  const handleSlotChange = (level: number, total: number) => {
    const formattedTotal = Number(formatNumber(total));
    updateCharacterData({
      spellSlots: characterData.spellSlots.map((slot) =>
        slot.level === level
          ? { ...slot, total: formattedTotal, used: slot.used.slice(0, formattedTotal) }
          : slot,
      ),
    });
  };

  const handleSlotToggle = (level: number, index: number) => {
    updateCharacterData({
      spellSlots: characterData.spellSlots.map((slot) =>
        slot.level === level
          ? {
              ...slot,
              used: slot.used.includes(index)
                ? slot.used.filter((i) => i !== index)
                : [...slot.used, index],
            }
          : slot,
      ),
    });
  };

  const handleLongRest = () => {
    updateCharacterData({
      spellSlots: characterData.spellSlots.map((slot) => ({ ...slot, used: [] })),
      specialEquipment: characterData.specialEquipment.map((item) =>
        item.usageType === 'Long Rest' ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    });
  };

  const handleShortRest = () => {
    updateCharacterData({
      specialEquipment: characterData.specialEquipment.map((item) =>
        item.usageType === 'Short Rest' ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    });
  };

  const handleDownloadJson = () => {
    const dataStr = JSON.stringify(characterData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'other-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUploadJsonClick = () => {
    if (jsonFileInputRef.current) jsonFileInputRef.current.click();
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result as string);
          if (isValidCharacterData(jsonData)) {
            setCharacterData(jsonData);
            alert('Character data successfully loaded!');
          } else {
            console.error('Invalid JSON structure:', jsonData);
            alert('Invalid JSON file format! Reverting to default data.');
            setCharacterData(defaultCharacterData);
          }
        } catch (error) {
          console.error('Error reading JSON file:', error);
          alert('Error reading JSON file! Reverting to default data.');
          setCharacterData(defaultCharacterData);
        }
      };
      reader.readAsText(file);
      if (jsonFileInputRef.current) jsonFileInputRef.current.value = '';
    }
  };

  const isValidCharacterData = (data: any): data is CharacterData => {
    if (!data || typeof data !== 'object') return false;
    return (
      Array.isArray(data.spells) &&
      data.spells.every((spell: any) => typeof spell.id === 'string' && typeof spell.name === 'string' && typeof spell.description === 'string') &&
      Array.isArray(data.equipment) &&
      data.equipment.every((equip: any) => typeof equip.id === 'string' && typeof equip.name === 'string' && typeof equip.description === 'string' && typeof equip.quantity === 'number') &&
      Array.isArray(data.specialEquipment) &&
      data.specialEquipment.every((equip: any) => typeof equip.id === 'string' && typeof equip.name === 'string' && typeof equip.description === 'string' && typeof equip.quantity === 'number') &&
      Array.isArray(data.firearms) &&
      data.firearms.every((firearm: any) => typeof firearm.id === 'string' && typeof firearm.name === 'string' && typeof firearm.description === 'string' && typeof firearm.damage === 'string' && typeof firearm.hitBonus === 'number') &&
      Array.isArray(data.implants) &&
      data.implants.every((implant: any) => typeof implant.id === 'string' && typeof implant.name === 'string' && typeof implant.description === 'string' && typeof implant.category === 'string') &&
      Array.isArray(data.spellSlots) &&
      data.spellSlots.every((slot: any) =>
        typeof slot.level === 'number' &&
        typeof slot.total === 'number' &&
        Array.isArray(slot.used) &&
        slot.used.every((i: any) => typeof i === 'number')
      )
    );
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="character-sheet">
      <button className="back-button" onClick={handleBack}>
        Back
      </button>
      <div className="section">
        <h2 className="section-title">RAM Slots</h2>
        <div className="spell-slots-container">
          {characterData.spellSlots && characterData.spellSlots.length > 0 ? (
            characterData.spellSlots.map((slot) => (
              <div key={slot.level} className="spell-slot-level">
                <label>
                  Level {formatNumber(slot.level)}:
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formatNumber(slot.total)}
                    onChange={(e) =>
                      handleSlotChange(slot.level, Number(e.target.value))
                    }
                    className="slot-input"
                  />
                </label>
                <div className="slot-checkboxes">
                  {Array.from({ length: slot.total }).map((_, index) => (
                    <label key={index} className="slot-checkbox-label">
                      <input
                        type="checkbox"
                        checked={slot.used.includes(index)}
                        onChange={() => handleSlotToggle(slot.level, index)}
                        className="slot-checkbox"
                      />
                      <span className="slot-checkbox-custom"></span>
                      Slot {formatNumber(index + 1)}
                    </label>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p>No spell slots available.</p>
          )}
        </div>
        <div className="rest-controls">
          <h3 className="rest-title">Відпочинок/JSON</h3>
          <div className="rest-block">
            <button className="rest-button long" onClick={handleLongRest}>
              Довгий відпочинок
            </button>
            <button className="rest-button short" onClick={handleShortRest}>
              Короткий відпочинок
            </button>
            <button className="rest-button long" onClick={handleDownloadJson}>
              Download JSON
            </button>
            <button className="rest-button" onClick={handleUploadJsonClick}>
              Upload JSON
            </button>
            <input
              type="file"
              accept="application/json"
              onChange={handleJsonUpload}
              ref={jsonFileInputRef}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Scripts</h2>
        <form onSubmit={handleAddSpell} className="spell-form">
          <div className="input-group">
            <label>
              Script Name:
              <input
                type="text"
                name="name"
                value={newSpell.name}
                onChange={handleSpellInputChange}
                placeholder="Enter script name"
                required
              />
            </label>
            <label>
              Level:
              <select name="level" value={newSpell.level} onChange={handleSpellInputChange}>
                <option value="0">0</option>
                {[...Array(9)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {formatNumber(i + 1)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Type:
              <select name="type" value={newSpell.type} onChange={handleSpellInputChange}>
                <option value="none">-</option>
                <option value="damage">Damage</option>
                <option value="heal">Heal</option>
              </select>
            </label>
            {newSpell.type !== 'none' && (
              <label>
                Value:
                <input
                  type="text"
                  name="damage"
                  value={newSpell.damage}
                  onChange={handleSpellInputChange}
                  placeholder={newSpell.type === 'damage' ? 'e.g., 2d6 fire' : 'e.g., 2d6 healing'}
                  required
                />
              </label>
            )}
            <label>
              Bonus Stat:
              <select name="bonusStat" value={newSpell.bonusStat} onChange={handleSpellInputChange}>
                {statOptions.map((stat) => (
                  <option key={stat || 'none'} value={stat}>
                    {stat || '-'}
                  </option>
                ))}
              </select>
            </label>
            {newSpell.bonusStat && (
              <label>
                Hit Bonus: +
                <input
                  type="number"
                  name="hitBonus"
                  value={formatNumber(newSpell.hitBonus)}
                  onChange={handleSpellInputChange}
                  placeholder="e.g., +2"
                />
              </label>
            )}
          </div>
          <label className="description-label">
            Description:
            <textarea
              name="description"
              value={newSpell.description}
              onChange={handleSpellInputChange}
              placeholder="Enter script description"
              required
            />
          </label>
          <button type="submit" className="add-spell-button">
            Add Script
          </button>
        </form>
        <div className="spells-list">
          {characterData.spells.length > 0 ? (
            characterData.spells.map((spell) => (
              <div key={spell.id} className="spell-card">
                <h3>{spell.name}</h3>
                <p>Level: {spell.level === 0 ? '0 (Cantrip)' : formatNumber(spell.level)}</p>
                <p>Type: {spell.type === 'damage' ? 'Damage' : spell.type === 'heal' ? 'Heal' : '-'}</p>
                {spell.damage && (
                  <p>{spell.type === 'damage' ? 'Damage' : 'Healing'}: {spell.damage}</p>
                )}
                {spell.bonusStat && <p>Bonus Stat: {spell.bonusStat}</p>}
                {spell.hitBonus !== undefined && (
                  <p>Hit Bonus: {spell.hitBonus >= 0 ? `+${spell.hitBonus}` : spell.hitBonus}</p>
                )}
                <p>{spell.description}</p>
                <button
                  className="delete-spell-button"
                  onClick={() => handleDeleteSpell(spell.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No scripts added yet.</p>
          )}
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Implants</h2>
        <form onSubmit={handleAddImplant} className="implant-form">
          <div className="input-group">
            <label>
              Category:
              <select name="category" value={newImplant.category} onChange={handleImplantInputChange}>
                {Object.keys(implantLimits).map((category) => (
                  <option key={category} value={category}>
                    {category} (Max: {implantLimits[category]})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Implant Name:
              <input
                type="text"
                name="name"
                value={newImplant.name}
                onChange={handleImplantInputChange}
                placeholder="Enter implant name"
                required
              />
            </label>
          </div>
          <label className="description-label">
            Description:
            <textarea
              name="description"
              value={newImplant.description}
              onChange={handleImplantInputChange}
              placeholder="Enter implant description"
              required
            />
          </label>
          <button type="submit" className="add-implant-button">
            Add Implant
          </button>
        </form>
        <div className="implants-list">
          {characterData.implants.length > 0 ? (
            Object.keys(implantLimits).map((category) => {
              const categoryImplants = characterData.implants.filter((implant) => implant.category === category);
              return categoryImplants.length > 0 ? (
                <div key={category} className="implant-category">
                  <h3>{category}</h3>
                  {categoryImplants.map((implant) => (
                    <div key={implant.id} className="implant-card">
                      <h4>{implant.name}</h4>
                      <p>{implant.description}</p>
                      <button
                        className="delete-implant-button"
                        onClick={() => handleDeleteImplant(implant.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : null;
            })
          ) : (
            <p>No implants added yet.</p>
          )}
        </div>
      </div>
      <div className="section firearm-section">
        <h2 className="section-title">Weapons</h2>
        <form onSubmit={handleAddFirearm} className="firearm-form">
          <div className="input-group">
            <label>
              Weapon Name:
              <input
                type="text"
                name="name"
                value={newFirearm.name}
                onChange={handleFirearmInputChange}
                placeholder="Enter weapon name"
                required
              />
            </label>
            <label>
              Damage:
              <input
                type="text"
                name="damage"
                value={newFirearm.damage}
                onChange={handleFirearmInputChange}
                placeholder="e.g., 2d8 piercing"
                required
              />
            </label>
            <label>
              Hit Bonus: +
              <input
                type="number"
                name="hitBonus"
                value={formatNumber(newFirearm.hitBonus)}
                onChange={handleFirearmInputChange}
                placeholder="e.g., +2"
                required
              />
            </label>
            <label>
              Bonus Stat:
              <select name="bonusStat" value={newFirearm.bonusStat} onChange={handleFirearmInputChange}>
                {statOptions.map((stat) => (
                  <option key={stat || 'none'} value={stat}>
                    {stat || '-'}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Has Ammo:
              <input
                type="checkbox"
                name="hasAmmo"
                checked={newFirearm.hasAmmo}
                onChange={handleFirearmInputChange}
              />
            </label>
            {newFirearm.hasAmmo && (
              <label>
                Ammo:
                <input
                  type="number"
                  name="ammo"
                  min="0"
                  value={formatNumber(newFirearm.ammo)}
                  onChange={handleFirearmInputChange}
                  required
                />
              </label>
            )}
          </div>
          <label className="description-label">
            Description:
            <textarea
              name="description"
              value={newFirearm.description}
              onChange={handleFirearmInputChange}
              placeholder="Enter weapon description"
              required
            />
          </label>
          <button type="submit" className="add-firearm-button">
            Add Weapon
          </button>
        </form>
        <div className="firearms-list">
          {characterData.firearms.length > 0 ? (
            characterData.firearms.map((firearm) => (
              <div key={firearm.id} className="firearm-card">
                <h3>{firearm.name}</h3>
                <p>Damage: {firearm.damage}</p>
                <p>Hit Bonus: {firearm.hitBonus >= 0 ? `+${firearm.hitBonus}` : firearm.hitBonus}</p>
                {firearm.bonusStat && <p>Bonus Stat: {firearm.bonusStat}</p>}
                <p>{firearm.description}</p>
                {firearm.hasAmmo && (
                  <div className="ammo-controls">
                    <p>Ammo: {formatNumber(firearm.ammo)}</p>
                    <div className="ammo-buttons">
                      <button
                        className="ammo-button decrease"
                        onClick={() => handleAmmoChange(firearm.id, -1)}
                      >
                        −
                      </button>
                      <button
                        className="ammo-button increase"
                        onClick={() => handleAmmoChange(firearm.id, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
                <button
                  className="delete-firearm-button"
                  onClick={() => handleDeleteFirearm(firearm.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No weapons added yet.</p>
          )}
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Equipment</h2>
        <form onSubmit={handleAddEquipment} className="equipment-form">
          <div className="input-group">
            <label>
              Item Name:
              <input
                type="text"
                name="name"
                value={newEquipment.name}
                onChange={handleEquipmentInputChange}
                placeholder="Enter item name"
                required
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                min="0"
                value={formatNumber(newEquipment.quantity)}
                onChange={handleEquipmentInputChange}
                required
              />
            </label>
          </div>
          <label className="description-label">
            Description:
            <textarea
              name="description"
              value={newEquipment.description}
              onChange={handleEquipmentInputChange}
              placeholder="Enter item description"
              required
            />
          </label>
          <button type="submit" className="add-equipment-button">
            Add Equipment
          </button>
        </form>
        <div className="equipment-list">
          {characterData.equipment.length > 0 ? (
            characterData.equipment.map((item) => (
              <div key={item.id} className="equipment-card">
                <h3>{item.name}</h3>
                <div className="quantity-controls">
                  <p>Quantity: {formatNumber(item.quantity)}</p>
                  <div className="quantity-buttons">
                    <button
                      className="quantity-button decrease"
                      onClick={() => handleQuantityChange(item.id, -1, false)}
                    >
                      −
                    </button>
                    <button
                      className="quantity-button increase"
                      onClick={() => handleQuantityChange(item.id, 1, false)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p>{item.description}</p>
                <button
                  className="delete-equipment-button"
                  onClick={() => handleDeleteEquipment(item.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No equipment added yet.</p>
          )}
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Special Equipment</h2>
        <form onSubmit={handleAddSpecialEquipment} className="equipment-form">
          <div className="input-group">
            <label>
              Special Item Name:
              <input
                type="text"
                name="name"
                value={newSpecialEquipment.name}
                onChange={handleSpecialEquipmentInputChange}
                placeholder="Enter special item name"
                required
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                min="0"
                value={formatNumber(newSpecialEquipment.quantity)}
                onChange={handleSpecialEquipmentInputChange}
                required
              />
            </label>
            <label>
              Usage Type:
              <select
                name="usageType"
                value={newSpecialEquipment.usageType}
                onChange={handleSpecialEquipmentInputChange}
              >
                <option value="None">-</option>
                <option value="Long Rest">Long Rest</option>
                <option value="Short Rest">Short Rest</option>
              </select>
            </label>
            <label>
              Has Damage/Heal Type:
              <input
                type="checkbox"
                name="hasType"
                checked={newSpecialEquipment.hasType}
                onChange={handleSpecialEquipmentInputChange}
              />
            </label>
            {newSpecialEquipment.hasType && (
              <>
                <label>
                  Type:
                  <select name="type" value={newSpecialEquipment.type} onChange={handleSpecialEquipmentInputChange}>
                    <option value="damage">Damage</option>
                    <option value="heal">Heal</option>
                  </select>
                </label>
                <label>
                  Value:
                  <input
                    type="text"
                    name="damage"
                    value={newSpecialEquipment.damage}
                    onChange={handleSpecialEquipmentInputChange}
                    placeholder={newSpecialEquipment.type === 'damage' ? 'e.g., 2d6 fire' : 'e.g., 2d6 healing'}
                    required
                  />
                </label>
                <label>
                  Bonus Stat:
                  <select name="bonusStat" value={newSpecialEquipment.bonusStat} onChange={handleSpecialEquipmentInputChange}>
                    {statOptions.map((stat) => (
                      <option key={stat || 'none'} value={stat}>
                        {stat || '-'}
                      </option>
                    ))}
                  </select>
                </label>
                {newSpecialEquipment.bonusStat && (
                  <label>
                    Hit Bonus: +
                    <input
                      type="number"
                      name="hitBonus"
                      value={formatNumber(newSpecialEquipment.hitBonus)}
                      onChange={handleSpecialEquipmentInputChange}
                      placeholder="e.g., +2"
                    />
                  </label>
                )}
              </>
            )}
          </div>
          <label className="description-label">
            Description:
            <textarea
              name="description"
              value={newSpecialEquipment.description}
              onChange={handleSpecialEquipmentInputChange}
              placeholder="Enter special item description"
              required
            />
          </label>
          <button type="submit" className="add-equipment-button">
            Add Special Equipment
          </button>
        </form>
        <div className="equipment-list">
          {characterData.specialEquipment.length > 0 ? (
            characterData.specialEquipment.map((item) => (
              <div key={item.id} className="equipment-card">
                <h3>{item.name}</h3>
                <div className="quantity-controls">
                  <p>Quantity: {formatNumber(item.quantity)}</p>
                  <div className="quantity-buttons">
                    <button
                      className="quantity-button decrease"
                      onClick={() => handleQuantityChange(item.id, -1, true)}
                    >
                      −
                    </button>
                    <button
                      className="quantity-button increase"
                      onClick={() => handleQuantityChange(item.id, 1, true)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <p>Usage Type: {item.usageType || 'None'}</p>
                {item.hasType && (
                  <>
                    <p>Type: {item.type === 'damage' ? 'Damage' : 'Heal'}</p>
                    <p>{item.type === 'damage' ? 'Damage' : 'Healing'}: {item.damage}</p>
                    {item.bonusStat && <p>Bonus Stat: {item.bonusStat}</p>}
                    {item.hitBonus !== undefined && (
                      <p>Hit Bonus: {item.hitBonus >= 0 ? `+${item.hitBonus}` : item.hitBonus}</p>
                    )}
                  </>
                )}
                <p>{item.description}</p>
                <button
                  className="delete-equipment-button"
                  onClick={() => handleDeleteSpecialEquipment(item.id)}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No special equipment added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};