import React, { useState, useEffect } from 'react';
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
  usageType?: 'Довгий відпочинок' | 'Короткий відпочинок' | 'Немає типу';
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

export const Other = () => {
  const navigate = useNavigate();
  const [spells, setSpells] = useState<Spell[]>(() => {
    const saved = localStorage.getItem('spells');
    return saved ? JSON.parse(saved) : [];
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
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('equipment');
    return saved ? JSON.parse(saved) : [];
  });
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    quantity: 0,
    description: '',
  });
  const [specialEquipment, setSpecialEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('specialEquipment');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSpecialEquipment, setNewSpecialEquipment] = useState({
    name: '',
    quantity: 0,
    description: '',
    usageType: 'Немає типу' as 'Довгий відпочинок' | 'Короткий відпочинок' | 'Немає типу',
    hasType: false,
    type: 'damage' as 'damage' | 'heal',
    damage: '',
    hitBonus: 0,
    bonusStat: '',
  });
  const [firearms, setFirearms] = useState<Firearm[]>(() => {
    const saved = localStorage.getItem('firearms');
    return saved ? JSON.parse(saved) : [];
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
  const [implants, setImplants] = useState<Implant[]>(() => {
    const saved = localStorage.getItem('implants');
    return saved ? JSON.parse(saved) : [];
  });
  const [newImplant, setNewImplant] = useState({
    name: '',
    description: '',
    category: 'Лобна частка',
  });
  const [spellSlots, setSpellSlots] = useState<SpellSlot[]>(() => {
    const saved = localStorage.getItem('spellSlots');
    return saved
      ? JSON.parse(saved)
      : Array.from({ length: 9 }, (_, i) => ({
          level: i + 1,
          total: 0,
          used: [],
        }));
  });

  useEffect(() => {
    localStorage.setItem('spells', JSON.stringify(spells));
  }, [spells]);

  useEffect(() => {
    localStorage.setItem('equipment', JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem('specialEquipment', JSON.stringify(specialEquipment));
  }, [specialEquipment]);

  useEffect(() => {
    localStorage.setItem('firearms', JSON.stringify(firearms));
  }, [firearms]);

  useEffect(() => {
    localStorage.setItem('implants', JSON.stringify(implants));
  }, [implants]);

  useEffect(() => {
    localStorage.setItem('spellSlots', JSON.stringify(spellSlots));
  }, [spellSlots]);

  const formatNumber = (num: number | string): string => {
    const numericValue = Number(num);
    return numericValue.toString().replace(/^0+/, '') || '0';
  };

  const implantLimits: { [key: string]: number } = {
    'Лобна частка': 3,
    'Руки': 1,
    'Скелет': 3,
    'Нервова система': 3,
    'Шкіра': 3,
    'Операційна система': 1,
    'Обличчя': 1,
    'Долоні': 2,
    'Кровоносна система': 3,
    'Ноги': 1,
  };

  const statOptions = [
    '',
    'Сила',
    'Спритність',
    'Статура',
    'Інтелект',
    'Реакція',
    'Харизма',
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
      setSpells((prev) => [...prev, spell]);
      setNewSpell({ name: '', level: 0, damage: '', description: '', type: 'none', bonusStat: '', hitBonus: 0 });
    }
  };

  const handleDeleteSpell = (id: string) => {
    setSpells((prev) => prev.filter((spell) => spell.id !== id));
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
      setEquipment((prev) => [...prev, equip]);
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
      const equip: Equipment = {
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
      setSpecialEquipment((prev) => [...prev, equip]);
      setNewSpecialEquipment({ 
        name: '', 
        quantity: 0, 
        description: '', 
        usageType: 'Немає типу',
        hasType: false,
        type: 'damage',
        damage: '',
        hitBonus: 0,
        bonusStat: '',
      });
    }
  };

  const handleDeleteEquipment = (id: string) => {
    setEquipment((prev) => prev.filter((equip) => equip.id !== id));
  };

  const handleDeleteSpecialEquipment = (id: string) => {
    setSpecialEquipment((prev) => prev.filter((equip) => equip.id !== id));
  };

  const handleQuantityChange = (id: string, change: number, isSpecial: boolean) => {
    const setItems = isSpecial ? setSpecialEquipment : setEquipment;
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + change) } : item,
      ),
    );
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
      setFirearms((prev) => [...prev, firearm]);
      setNewFirearm({ name: '', damage: '', hitBonus: 0, description: '', hasAmmo: false, ammo: 0, bonusStat: '' });
    }
  };

  const handleDeleteFirearm = (id: string) => {
    setFirearms((prev) => prev.filter((firearm) => firearm.id !== id));
  };

  const handleImplantInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewImplant((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImplant = (e: React.FormEvent) => {
    e.preventDefault();
    const currentCount = implants.filter((implant) => implant.category === newImplant.category).length;
    if (currentCount >= implantLimits[newImplant.category]) {
      alert(`Досягнуто максимальної кількості імплантів для категорії "${newImplant.category}" (${implantLimits[newImplant.category]}).`);
      return;
    }
    if (newImplant.name && newImplant.description) {
      const implant: Implant = {
        id: crypto.randomUUID(),
        name: newImplant.name,
        description: newImplant.description,
        category: newImplant.category,
      };
      setImplants((prev) => [...prev, implant]);
      setNewImplant({ name: '', description: '', category: 'Лобна частка' });
    }
  };

  const handleDeleteImplant = (id: string) => {
    setImplants((prev) => prev.filter((implant) => implant.id !== id));
  };

  const handleAmmoChange = (id: string, change: number) => {
    setFirearms((prev) =>
      prev.map((firearm) =>
        firearm.id === id && firearm.hasAmmo
          ? { ...firearm, ammo: Math.max(0, firearm.ammo + change) }
          : firearm,
      ),
    );
  };

  const handleSlotChange = (level: number, total: number) => {
    const formattedTotal = Number(formatNumber(total));
    setSpellSlots((prev) =>
      prev.map((slot) =>
        slot.level === level
          ? { ...slot, total: formattedTotal, used: slot.used.slice(0, formattedTotal) }
          : slot,
      ),
    );
  };

  const handleSlotToggle = (level: number, index: number) => {
    setSpellSlots((prev) =>
      prev.map((slot) =>
        slot.level === level
          ? {
              ...slot,
              used: slot.used.includes(index)
                ? slot.used.filter((i) => i !== index)
                : [...slot.used, index],
            }
          : slot,
      ),
    );
  };

  const handleLongRest = () => {
    setSpellSlots((prev) =>
      prev.map((slot) => ({ ...slot, used: [] })),
    );
    setSpecialEquipment((prev) =>
      prev.map((item) =>
        item.usageType === 'Довгий відпочинок' ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleShortRest = () => {
    setSpecialEquipment((prev) =>
      prev.map((item) =>
        item.usageType === 'Короткий відпочинок' ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="character-sheet">
      <button className="back-button" onClick={handleBack}>
        Назад
      </button>
      <div className="section">
        <h2 className="section-title">Слоти оперативної пам’яті</h2>
        <div className="spell-slots-container">
          {spellSlots.map((slot) => (
            <div key={slot.level} className="spell-slot-level">
              <label>
                Рівень {formatNumber(slot.level)}:
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
                    Слот {formatNumber(index + 1)}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rest-controls">
          <h3 className="rest-title">Відпочинок</h3>
          <div className="rest-block">
            <button className="rest-button long" onClick={handleLongRest}>
              Довгий відпочинок
            </button>
            <button className="rest-button short" onClick={handleShortRest}>
              Короткий відпочинок
            </button>
          </div>
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Скрипти</h2>
        <form onSubmit={handleAddSpell} className="spell-form">
          <div className="input-group">
            <label>
              Назва скрипту:
              <input
                type="text"
                name="name"
                value={newSpell.name}
                onChange={handleSpellInputChange}
                placeholder="Введіть назву скрипту"
                required
              />
            </label>
            <label>
              Рівень:
              <select name="level" value={newSpell.level} onChange={handleSpellInputChange}>
                <option value="0">0 (Замовляння)</option>
                {[...Array(9)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {formatNumber(i + 1)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Тип:
              <select name="type" value={newSpell.type} onChange={handleSpellInputChange}>
                <option value="none">-</option>
                <option value="damage">Урон</option>
                <option value="heal">Хіл</option>
              </select>
            </label>
            {newSpell.type !== 'none' && (
              <label>
                Значення:
                <input
                  type="text"
                  name="damage"
                  value={newSpell.damage}
                  onChange={handleSpellInputChange}
                  placeholder={newSpell.type === 'damage' ? 'Напр., 2d6 вогню' : 'Напр., 2d6 зцілення'}
                  required
                />
              </label>
            )}
            <label>
              Характеристика бонусу:
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
                Бонус на попадання: +
                <input
                  type="number"
                  name="hitBonus"
                  value={formatNumber(newSpell.hitBonus)}
                  onChange={handleSpellInputChange}
                  placeholder="Напр., +2"
                />
              </label>
            )}
          </div>
          <label className="description-label">
            Опис:
            <textarea
              name="description"
              value={newSpell.description}
              onChange={handleSpellInputChange}
              placeholder="Введіть опис скрипту"
              required
            />
          </label>
          <button type="submit" className="add-spell-button">
            Додати скрипт
          </button>
        </form>
        <div className="spells-list">
          {spells.length > 0 ? (
            spells.map((spell) => (
              <div key={spell.id} className="spell-card">
                <h3>{spell.name}</h3>
                <p>Рівень: {spell.level === 0 ? '0 (Замовляння)' : formatNumber(spell.level)}</p>
                <p>Тип: {spell.type === 'damage' ? 'Урон' : spell.type === 'heal' ? 'Хіл' : '-'}</p>
                {spell.damage && (
                  <p>{spell.type === 'damage' ? 'Урон' : 'Зцілення'}: {spell.damage}</p>
                )}
                {spell.bonusStat && <p>Характеристика бонусу: {spell.bonusStat}</p>}
                {spell.hitBonus !== undefined && (
                  <p>Бонус на попадання: {spell.hitBonus >= 0 ? `+${spell.hitBonus}` : spell.hitBonus}</p>
                )}
                <p>{spell.description}</p>
                <button
                  className="delete-spell-button"
                  onClick={() => handleDeleteSpell(spell.id)}
                >
                  Видалити
                </button>
              </div>
            ))
          ) : (
            <p>Скрипти ще не додані.</p>
          )}
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Імпланти</h2>
        <form onSubmit={handleAddImplant} className="implant-form">
          <div className="input-group">
            <label>
              Категорія:
              <select name="category" value={newImplant.category} onChange={handleImplantInputChange}>
                {Object.keys(implantLimits).map((category) => (
                  <option key={category} value={category}>
                    {category} (Макс: {implantLimits[category]})
                  </option>
                ))}
              </select>
            </label>
            <label>
              Назва імпланту:
              <input
                type="text"
                name="name"
                value={newImplant.name}
                onChange={handleImplantInputChange}
                placeholder="Введіть назву імпланту"
                required
              />
            </label>
          </div>
          <label className="description-label">
            Опис:
            <textarea
              name="description"
              value={newImplant.description}
              onChange={handleImplantInputChange}
              placeholder="Введіть опис імпланту"
              required
            />
          </label>
          <button type="submit" className="add-implant-button">
            Додати імплант
          </button>
        </form>
        <div className="implants-list">
          {implants.length > 0 ? (
            Object.keys(implantLimits).map((category) => {
              const categoryImplants = implants.filter((implant) => implant.category === category);
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
                        Видалити
                      </button>
                    </div>
                  ))}
                </div>
              ) : null;
            })
          ) : (
            <p>Імпланти ще не додані.</p>
          )}
        </div>
      </div>
      <div className="section firearm-section">
        <h2 className="section-title">Зброя</h2>
        <form onSubmit={handleAddFirearm} className="firearm-form">
          <div className="input-group">
            <label>
              Назва зброї:
              <input
                type="text"
                name="name"
                value={newFirearm.name}
                onChange={handleFirearmInputChange}
                placeholder="Введіть назву зброї"
                required
              />
            </label>
            <label>
              Урон:
              <input
                type="text"
                name="damage"
                value={newFirearm.damage}
                onChange={handleFirearmInputChange}
                placeholder="Напр., 2d8 колючий"
                required
              />
            </label>
            <label>
              Бонус на попадання: +
              <input
                type="number"
                name="hitBonus"
                value={formatNumber(newFirearm.hitBonus)}
                onChange={handleFirearmInputChange}
                placeholder="Напр., +2"
                required
              />
            </label>
            <label>
              Характеристика бонусу:
              <select name="bonusStat" value={newFirearm.bonusStat} onChange={handleFirearmInputChange}>
                {statOptions.map((stat) => (
                  <option key={stat || 'none'} value={stat}>
                    {stat || '-'}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Має патрони:
              <input
                type="checkbox"
                name="hasAmmo"
                checked={newFirearm.hasAmmo}
                onChange={handleFirearmInputChange}
              />
            </label>
            {newFirearm.hasAmmo && (
              <label>
                Патрони:
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
            Опис:
            <textarea
              name="description"
              value={newFirearm.description}
              onChange={handleFirearmInputChange}
              placeholder="Введіть опис зброї"
              required
            />
          </label>
          <button type="submit" className="add-firearm-button">
            Додати зброю
          </button>
        </form>
        <div className="firearms-list">
          {firearms.length > 0 ? (
            firearms.map((firearm) => (
              <div key={firearm.id} className="firearm-card">
                <h3>{firearm.name}</h3>
                <p>Урон: {firearm.damage}</p>
                <p>Бонус на попадання: {firearm.hitBonus >= 0 ? `+${firearm.hitBonus}` : firearm.hitBonus}</p>
                {firearm.bonusStat && <p>Характеристика бонусу: {firearm.bonusStat}</p>}
                <p>{firearm.description}</p>
                {firearm.hasAmmo && (
                  <div className="ammo-controls">
                    <p>Патрони: {formatNumber(firearm.ammo)}</p>
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
                  Видалити
                </button>
              </div>
            ))
          ) : (
            <p>Зброя ще не додана.</p>
          )}
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Спорядження</h2>
        <form onSubmit={handleAddEquipment} className="equipment-form">
          <div className="input-group">
            <label>
              Назва предмета:
              <input
                type="text"
                name="name"
                value={newEquipment.name}
                onChange={handleEquipmentInputChange}
                placeholder="Введіть назву предмета"
                required
              />
            </label>
            <label>
              Кількість:
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
            Опис:
            <textarea
              name="description"
              value={newEquipment.description}
              onChange={handleEquipmentInputChange}
              placeholder="Введіть опис предмета"
              required
            />
          </label>
          <button type="submit" className="add-equipment-button">
            Додати спорядження
          </button>
        </form>
        <div className="equipment-list">
          {equipment.length > 0 ? (
            equipment.map((item) => (
              <div key={item.id} className="equipment-card">
                <h3>{item.name}</h3>
                <div className="quantity-controls">
                  <p>Кількість: {formatNumber(item.quantity)}</p>
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
                  Видалити
                </button>
              </div>
            ))
          ) : (
            <p>Спорядження ще не додане.</p>
          )}
        </div>
      </div>
      <div className="section">
        <h2 className="section-title">Особливе спорядження</h2>
        <form onSubmit={handleAddSpecialEquipment} className="equipment-form">
          <div className="input-group">
            <label>
              Назва особливого предмета:
              <input
                type="text"
                name="name"
                value={newSpecialEquipment.name}
                onChange={handleSpecialEquipmentInputChange}
                placeholder="Введіть назву предмета"
                required
              />
            </label>
            <label>
              Кількість:
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
              Тип використання:
              <select
                name="usageType"
                value={newSpecialEquipment.usageType}
                onChange={handleSpecialEquipmentInputChange}
              >
                <option value="Немає типу">-</option>
                <option value="Довгий відпочинок">Довгий відпочинок</option>
                <option value="Короткий відпочинок">Короткий відпочинок</option>
              </select>
            </label>
            <label>
              Має тип урон/хіл:
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
                  Тип:
                  <select name="type" value={newSpecialEquipment.type} onChange={handleSpecialEquipmentInputChange}>
                    <option value="damage">Урон</option>
                    <option value="heal">Хіл</option>
                  </select>
                </label>
                <label>
                  Значення:
                  <input
                    type="text"
                    name="damage"
                    value={newSpecialEquipment.damage}
                    onChange={handleSpecialEquipmentInputChange}
                    placeholder={newSpecialEquipment.type === 'damage' ? 'Напр., 2d6 вогню' : 'Напр., 2d6 зцілення'}
                    required
                  />
                </label>
                <label>
                  Характеристика бонусу:
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
                    Бонус на попадання: +
                    <input
                      type="number"
                      name="hitBonus"
                      value={formatNumber(newSpecialEquipment.hitBonus)}
                      onChange={handleSpecialEquipmentInputChange}
                      placeholder="Напр., +2"
                    />
                  </label>
                )}
              </>
            )}
          </div>
          <label className="description-label">
            Опис:
            <textarea
              name="description"
              value={newSpecialEquipment.description}
              onChange={handleSpecialEquipmentInputChange}
              placeholder="Введіть опис предмета"
              required
            />
          </label>
          <button type="submit" className="add-equipment-button">
            Додати особливе спорядження
          </button>
        </form>
        <div className="equipment-list">
          {specialEquipment.length > 0 ? (
            specialEquipment.map((item) => (
              <div key={item.id} className="equipment-card">
                <h3>{item.name}</h3>
                <div className="quantity-controls">
                  <p>Кількість: {formatNumber(item.quantity)}</p>
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
                <p>Тип використання: {item.usageType || 'Немає типу'}</p>
                {item.hasType && (
                  <>
                    <p>Тип: {item.type === 'damage' ? 'Урон' : 'Хіл'}</p>
                    <p>{item.type === 'damage' ? 'Урон' : 'Зцілення'}: {item.damage}</p>
                    {item.bonusStat && <p>Характеристика бонусу: {item.bonusStat}</p>}
                    {item.hitBonus !== undefined && (
                      <p>Бонус на попадання: {item.hitBonus >= 0 ? `+${item.hitBonus}` : item.hitBonus}</p>
                    )}
                  </>
                )}
                <p>{item.description}</p>
                <button
                  className="delete-equipment-button"
                  onClick={() => handleDeleteSpecialEquipment(item.id)}
                >
                  Видалити
                </button>
              </div>
            ))
          ) : (
            <p>Особливе спорядження ще не додане.</p>
          )}
        </div>
      </div>
    </div>
  );
};