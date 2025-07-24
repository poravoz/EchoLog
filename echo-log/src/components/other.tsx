import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Other.css';

interface Spell {
  id: string;
  name: string;
  level: number;
  damage: string;
  description: string;
}

interface Equipment {
  id: string;
  name: string;
  quantity: number;
  description: string;
}

interface Firearm {
  id: string;
  name: string;
  damage: string;
  description: string;
  hasAmmo: boolean;
  ammo: number;
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
    level: 1,
    damage: '',
    description: '',
  });
  const [equipment, setEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('equipment');
    return saved ? JSON.parse(saved) : [];
  });
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    quantity: 1,
    description: '',
  });
  const [specialEquipment, setSpecialEquipment] = useState<Equipment[]>(() => {
    const saved = localStorage.getItem('specialEquipment');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSpecialEquipment, setNewSpecialEquipment] = useState({
    name: '',
    quantity: 1,
    description: '',
  });
  const [firearms, setFirearms] = useState<Firearm[]>(() => {
    const saved = localStorage.getItem('firearms');
    return saved ? JSON.parse(saved) : [];
  });
  const [newFirearm, setNewFirearm] = useState({
    name: '',
    damage: '',
    description: '',
    hasAmmo: false,
    ammo: 0,
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
    return numericValue === 0 ? '0' : numericValue.toString().replace(/^0+/, '');
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

  const handleSpellInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewSpell((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSpell = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpell.name && newSpell.damage && newSpell.description) {
      const spell: Spell = {
        id: crypto.randomUUID(),
        name: newSpell.name,
        level: Number(newSpell.level),
        damage: newSpell.damage,
        description: newSpell.description,
      };
      setSpells((prev) => [...prev, spell]);
      setNewSpell({ name: '', level: 1, damage: '', description: '' });
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
    if (newEquipment.name && newEquipment.quantity > 0 && newEquipment.description) {
      const equip: Equipment = {
        id: crypto.randomUUID(),
        name: newEquipment.name,
        quantity: Number(newEquipment.quantity),
        description: newEquipment.description,
      };
      setEquipment((prev) => [...prev, equip]);
      setNewEquipment({ name: '', quantity: 1, description: '' });
    }
  };

  const handleSpecialEquipmentInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewSpecialEquipment((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Number(formatNumber(value)) : value,
    }));
  };

  const handleAddSpecialEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpecialEquipment.name && newSpecialEquipment.quantity > 0 && newSpecialEquipment.description) {
      const equip: Equipment = {
        id: crypto.randomUUID(),
        name: newSpecialEquipment.name,
        quantity: Number(newSpecialEquipment.quantity),
        description: newSpecialEquipment.description,
      };
      setSpecialEquipment((prev) => [...prev, equip]);
      setNewSpecialEquipment({ name: '', quantity: 1, description: '' });
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
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item,
      ),
    );
  };

  const handleFirearmInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setNewFirearm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
             name === 'ammo' ? Number(formatNumber(value)) : value,
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
        description: newFirearm.description,
        hasAmmo: newFirearm.hasAmmo,
        ammo: newFirearm.hasAmmo ? Number(newFirearm.ammo) : 0,
      };
      setFirearms((prev) => [...prev, firearm]);
      setNewFirearm({ name: '', damage: '', description: '', hasAmmo: false, ammo: 0 });
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

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="character-sheet">
      <button className="back-button" onClick={handleBack}>
        Назад
      </button>
      <div className="section">
        <h2 className="section-title">Слоти оперативної пам’яті/ або щось, що вам хотілось би відслідковувати</h2>
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
                    />
                    Слот {formatNumber(index + 1)}
                  </label>
                ))}
              </div>
            </div>
          ))}
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
                {[...Array(9)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {formatNumber(i + 1)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Урон:
              <input
                type="text"
                name="damage"
                value={newSpell.damage}
                onChange={handleSpellInputChange}
                placeholder="Напр., 2d6 вогню"
                required
              />
            </label>
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
                <p>Рівень: {formatNumber(spell.level)}</p>
                <p>Урон: {spell.damage}</p>
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
      <div className="section">
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
                min="1"
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
                min="1"
                value={formatNumber(newSpecialEquipment.quantity)}
                onChange={handleSpecialEquipmentInputChange}
                required
              />
            </label>
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