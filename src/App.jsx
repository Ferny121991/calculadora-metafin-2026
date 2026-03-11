import React, { useState, useEffect } from 'react';
import {
  Wallet, TrendingDown, Plane, Car, Home, Smartphone,
  Zap, Wifi, Utensils, Scissors, Heart, Gift,
  Target, DollarSign, Calendar, LayoutDashboard, CheckSquare, Square,
  Trophy, Flame, Sparkles, Shield, RefreshCw, PlusCircle, AlertCircle,
  Edit3, ArrowRight, History, Download, PiggyBank, Briefcase, CreditCard,
  PieChart as PieChartIcon, Activity
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';

// --- Default Data ---
const DEFAULT_INCOMES = [
  { id: 1, name: 'Walmart (Neto post-ahorro)', amount: 2460, icon: 'Wallet', dueDay: 15 },
  { id: 2, name: 'Ingreso Extra Fijo', amount: 640, icon: 'DollarSign', dueDay: 1 },
  { id: 3, name: 'Uber (Fines de semana)', amount: 1120, icon: 'Car', dueDay: 28 },
];

const DEFAULT_EXPENSES = [
  { id: 1, name: 'Casa', amount: 800, icon: 'Home', dueDay: 1 },
  { id: 2, name: 'Pago Carro', amount: 550, icon: 'Car', dueDay: 15 },
  { id: 3, name: 'Seguro Carro', amount: 220, icon: 'Car', dueDay: 18 },
  { id: 4, name: 'Diezmo', amount: 260, icon: 'Heart', dueDay: 15 },
  { id: 5, name: 'Gasolina', amount: 200, icon: 'Zap', dueDay: 1 },
  { id: 6, name: 'Luz', amount: 90, icon: 'Zap', dueDay: 10 },
  { id: 7, name: 'Internet', amount: 70, icon: 'Wifi', dueDay: 5 },
  { id: 8, name: 'Teléfono', amount: 60, icon: 'Smartphone', dueDay: 12 },
  { id: 9, name: 'Suscripciones (Hosting, IA)', amount: 60, icon: 'Wifi', dueDay: 2 },
  { id: 10, name: 'Comida ($75 quincenal)', amount: 150, icon: 'Utensils', dueDay: 15 },
  { id: 11, name: 'Para Sheila', amount: 280, icon: 'Gift', dueDay: 15 },
  { id: 12, name: 'Recortes', amount: 90, icon: 'Scissors', dueDay: 15 },
  { id: 13, name: 'Gustos Personales', amount: 80, icon: 'Wallet', dueDay: 1 },
  { id: 14, name: 'Mínimo Préstamo Personal', amount: 165, icon: 'TrendingDown', dueDay: 5 },
  { id: 15, name: 'Mínimo Préstamo Estudiantil', amount: 135, icon: 'TrendingDown', dueDay: 28 },
  { id: 16, name: 'Fondo de Emergencia', amount: 200, icon: 'Shield', dueDay: 1 },
];

const DEFAULT_Q1 = [
  { id: 'q1-1', type: 'income', text: 'Cobro Walmart + Extra + Uber', amount: 2110, done: false },
  { id: 'q1-2', type: 'fixed', text: 'Pagar Casa', amount: 800, done: false },
  { id: 'q1-3', type: 'fixed', text: 'Separar Diezmo', amount: 130, done: false },
  { id: 'q1-4', type: 'fixed', text: 'Pagar Luz', amount: 90, done: false },
  { id: 'q1-5', type: 'fixed', text: 'Pagar Internet', amount: 70, done: false },
  { id: 'q1-12', type: 'debt-min', debtId: 'personal', text: 'Pago Mínimo Préstamo Personal', amount: 165, done: false },
  { id: 'q1-14', type: 'debt-min', debtId: 'tarjeta', text: 'Pago Normal Tarjeta', amount: 150, done: false },
  { id: 'q1-6', type: 'variable', text: 'Enviar a Sheila (Mitad)', amount: 140, done: false, adelanto: 0 },
  { id: 'q1-7', type: 'variable', text: 'Separar Comida', amount: 75, done: false, adelanto: 0 },
  { id: 'q1-8', type: 'variable', text: 'Separar Gasolina', amount: 100, done: false, adelanto: 0 },
  { id: 'q1-9', type: 'variable', text: 'Separar Recorte y Gustos', amount: 85, done: false, adelanto: 0 },
  { id: 'q1-10', type: 'savings', text: 'Guardar para Viaje RD', amount: 80, done: false },
  { id: 'q1-13', type: 'savings', text: 'Fondo de Emergencia', amount: 100, done: false },
  { id: 'q1-11', type: 'snowball', text: 'Abonar EXCEDENTE a', amount: 125, done: false, isDynamic: true },
];

const DEFAULT_Q2 = [
  { id: 'q2-1', type: 'income', text: 'Cobro Walmart + Extra + Uber', amount: 2110, done: false },
  { id: 'q2-2', type: 'fixed', text: 'Pagar Carro', amount: 550, done: false },
  { id: 'q2-3', type: 'fixed', text: 'Pagar Seguro del Carro', amount: 220, done: false },
  { id: 'q2-4', type: 'fixed', text: 'Separar Diezmo', amount: 130, done: false },
  { id: 'q2-5', type: 'fixed', text: 'Pagar Teléfono', amount: 60, done: false },
  { id: 'q2-6', type: 'fixed', text: 'Pagar Suscripciones', amount: 60, done: false },
  { id: 'q2-13', type: 'debt-min', debtId: 'estudiantil', text: 'Pago Mínimo Estudiantil', amount: 135, done: false },
  { id: 'q2-15', type: 'debt-min', debtId: 'tarjeta', text: 'Pago Normal Tarjeta', amount: 150, done: false },
  { id: 'q2-7', type: 'variable', text: 'Enviar a Sheila (Mitad)', amount: 140, done: false, adelanto: 0 },
  { id: 'q2-8', type: 'variable', text: 'Separar Comida', amount: 75, done: false, adelanto: 0 },
  { id: 'q2-9', type: 'variable', text: 'Separar Gasolina', amount: 100, done: false, adelanto: 0 },
  { id: 'q2-10', type: 'variable', text: 'Separar Recorte y Gustos', amount: 85, done: false, adelanto: 0 },
  { id: 'q2-11', type: 'savings', text: 'Guardar para Viaje RD', amount: 80, done: false },
  { id: 'q2-14', type: 'savings', text: 'Fondo de Emergencia', amount: 100, done: false },
  { id: 'q2-12', type: 'snowball', text: 'Abonar EXCEDENTE a', amount: 225, done: false, isDynamic: true },
];

const DEFAULT_DEBTS = [
  { id: 'tarjeta', name: 'Tarjeta', balance: 2500, initial: 2500, apr: 24, dueDay: 15 },
  { id: 'personal', name: 'Préstamo Personal', balance: 3120, initial: 3120, apr: 12, dueDay: 5 },
  { id: 'estudiantil', name: 'Préstamo Estudiantil', balance: 11800, initial: 11800, apr: 6, dueDay: 28 },
];

const DEFAULT_WALLETS = [
  { id: 'cheques', name: 'Cuenta Cheques', balance: 1200, icon: 'Briefcase' },
  { id: 'ahorros', name: 'Ahorros', balance: 800, icon: 'PiggyBank' },
  { id: 'efectivo', name: 'Efectivo', balance: 150, icon: 'Wallet' },
];

// --- Helper Functions for Local Storage ---
const loadData = (key, defaultData) => {
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  return defaultData;
};

const App = () => {
  const [activeTab, setActiveTab] = useState('contable');

  // State initialized from local storage
  const [racha, setRacha] = useState(() => loadData('meta2026_racha', 0));
  const [q1Tasks, setQ1Tasks] = useState(() => {
    const data = loadData('meta2026_q1_v2', DEFAULT_Q1);
    return data.map(t => t.id === 'q1-11' && t.amount === 275 ? { ...t, amount: 125 } : t);
  });
  const [q2Tasks, setQ2Tasks] = useState(() => {
    const data = loadData('meta2026_q2_v2', DEFAULT_Q2);
    return data.map(t => t.id === 'q2-12' && t.amount === 375 ? { ...t, amount: 225 } : t);
  });

  const [incomes, setIncomes] = useState(() => loadData('meta2026_incomes', DEFAULT_INCOMES));
  const [expenses, setExpenses] = useState(() => loadData('meta2026_expenses', DEFAULT_EXPENSES));
  const [debts, setDebts] = useState(() => loadData('meta2026_debts_v2', DEFAULT_DEBTS));

  // Side Hustle Tracker State
  const [sideHustles, setSideHustles] = useState(() => loadData('meta2026_sideHustles', []));
  const [newHustleDesc, setNewHustleDesc] = useState('');
  const [newHustleAmount, setNewHustleAmount] = useState('');

  // Achievements
  const [achievements, setAchievements] = useState(() => loadData('meta2026_achievements', {
    firstQPerfect: false,
    debtDestroyer: false,
    saverMonth: false,
    streak3Months: false
  }));

  // Nuevos estados para V3
  const [history, setHistory] = useState(() => loadData('meta2026_history', []));
  const [wallets, setWallets] = useState(() => loadData('meta2026_wallets', DEFAULT_WALLETS));
  const [whatIfExtra, setWhatIfExtra] = useState(0); // Para el simulador
  const [whatIfInput, setWhatIfInput] = useState('');

  // Save to local storage whenever state changes
  useEffect(() => { localStorage.setItem('meta2026_racha', JSON.stringify(racha)); }, [racha]);
  useEffect(() => { localStorage.setItem('meta2026_q1_v2', JSON.stringify(q1Tasks)); }, [q1Tasks]);
  useEffect(() => { localStorage.setItem('meta2026_q2_v2', JSON.stringify(q2Tasks)); }, [q2Tasks]);
  useEffect(() => { localStorage.setItem('meta2026_incomes', JSON.stringify(incomes)); }, [incomes]);
  useEffect(() => { localStorage.setItem('meta2026_expenses', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('meta2026_debts_v2', JSON.stringify(debts)); }, [debts]);
  useEffect(() => { localStorage.setItem('meta2026_sideHustles', JSON.stringify(sideHustles)); }, [sideHustles]);
  useEffect(() => { localStorage.setItem('meta2026_achievements', JSON.stringify(achievements)); }, [achievements]);
  useEffect(() => { localStorage.setItem('meta2026_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('meta2026_wallets', JSON.stringify(wallets)); }, [wallets]);


  // ================= CALCS =================
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const activeDebt = debts.find(d => d.balance > 0) || debts[debts.length - 1]; // Fallback to last if all paid
  const totalDebtBalance = debts.reduce((acc, curr) => acc + curr.balance, 0);
  const deudaTotalInicial = debts.reduce((acc, curr) => acc + curr.initial, 0);

  const totalSideHustle = sideHustles.reduce((acc, curr) => acc + curr.amount, 0);

  const totalMinimosOtras = [...q1Tasks, ...q2Tasks].reduce((acc, t) => {
    if (t.type === 'debt-min' && t.debtId !== activeDebt.id) return acc + (t.amount - (t.adelanto || 0));
    return acc;
  }, 0);

  const poderAtaqueActiva = [...q1Tasks, ...q2Tasks].reduce((acc, t) => {
    if (t.type === 'snowball' || (t.type === 'debt-min' && t.debtId === activeDebt.id)) return acc + (t.amount - (t.adelanto || 0));
    return acc;
  }, totalSideHustle);

  const poderTotalDeudas = totalMinimosOtras + poderAtaqueActiva;

  const calculatePayoffDates = (baseDebts, extraSimulator = 0) => {
    let result = {};
    let tempDebts = baseDebts.map(d => ({ ...d }));
    let monthsElapsed = 0;

    while (tempDebts.some(d => d.balance > 0) && monthsElapsed < 240) {
      monthsElapsed++;
      // Simulamos los pagos en base a compromisos actuales
      let snowball = (monthsElapsed === 1) ? totalSideHustle : 0;
      snowball += extraSimulator; // Inyectar simulador

      [...q1Tasks, ...q2Tasks].forEach(t => { if (t.type === 'snowball') snowball += t.amount; });

      tempDebts.forEach(d => {
        if (d.balance > 0) {
          // Add Interest calculation (compound approximation per month)
          const interestMultiplier = d.apr ? (d.apr / 100 / 12) : 0;
          d.balance += d.balance * interestMultiplier;

          let minPayment = 0;
          [...q1Tasks, ...q2Tasks].forEach(t => { if (t.type === 'debt-min' && t.debtId === d.id) minPayment += t.amount; });

          if (minPayment > d.balance) {
            snowball += (minPayment - d.balance);
            d.balance = 0;
          } else {
            d.balance -= minPayment;
          }
        }
      });

      for (let i = 0; i < tempDebts.length; i++) {
        if (snowball <= 0) break;
        if (tempDebts[i].balance > 0) {
          if (snowball >= tempDebts[i].balance) {
            snowball -= tempDebts[i].balance;
            tempDebts[i].balance = 0;
          } else {
            tempDebts[i].balance -= snowball;
            snowball = 0;
          }
        }
      }

      tempDebts.forEach(d => {
        if (d.balance === 0 && !result[d.id]) {
          const dObj = new Date();
          dObj.setMonth(dObj.getMonth() + monthsElapsed);
          const mesNum = dObj.getMonth() + 1;
          const year = dObj.getFullYear();
          result[d.id] = `${mesNum < 10 ? '0' + mesNum : mesNum}/${year}`;
        }
      });
    }
    return result;
  };

  const payoffDatesMemo = React.useMemo(() => calculatePayoffDates(debts, 0), [debts, q1Tasks, q2Tasks, totalSideHustle]);
  const whatIfDatesMemo = React.useMemo(() => calculatePayoffDates(debts, whatIfExtra), [debts, q1Tasks, q2Tasks, totalSideHustle, whatIfExtra]);

  // Check achievements
  useEffect(() => {
    let changed = false;
    let newAchs = { ...achievements };

    const isQ1Done = q1Tasks.every(t => t.done);
    const isQ2Done = q2Tasks.every(t => t.done);

    if ((isQ1Done || isQ2Done) && !newAchs.firstQPerfect) {
      newAchs.firstQPerfect = true;
      changed = true;
    }

    if (totalSideHustle >= 500 && !newAchs.debtDestroyer) {
      newAchs.debtDestroyer = true;
      changed = true;
    }

    if (racha >= 6 && !newAchs.streak3Months) {
      newAchs.streak3Months = true; // 3 meses = 6 quincenas
      changed = true;
    }

    if (changed) setAchievements(newAchs);
  }, [q1Tasks, q2Tasks, totalSideHustle, achievements, racha]);


  // ================= ACTIONS =================
  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f43f5e']
    });
  };

  const toggleTask = (quincena, id) => {
    let newTasks;
    let isCompleted = false;

    if (quincena === 1) {
      newTasks = q1Tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
      setQ1Tasks(newTasks);
      isCompleted = newTasks.every(t => t.done);
    } else {
      newTasks = q2Tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
      setQ2Tasks(newTasks);
      isCompleted = newTasks.every(t => t.done);
    }

    const oldWasCompleted = quincena === 1 ? q1Tasks.every(t => t.done) : q2Tasks.every(t => t.done);
    if (isCompleted && !oldWasCompleted) {
      triggerConfetti();
      setRacha(prev => prev + 1);
    }
  };

  const handleAdelanto = (e, quincena, id) => {
    e.stopPropagation();
    const tasks = quincena === 1 ? q1Tasks : q2Tasks;
    const task = tasks.find(t => t.id === id);
    const currentValue = task?.adelanto || 0;

    const value = window.prompt("¿Cuánto ya adelantaste o pagaste? (Actual: $" + currentValue + ")", currentValue);
    if (value !== null) {
      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed >= 0) {
        if (quincena === 1) {
          setQ1Tasks(q1Tasks.map(t => t.id === id ? { ...t, adelanto: parsed } : t));
        } else {
          setQ2Tasks(q2Tasks.map(t => t.id === id ? { ...t, adelanto: parsed } : t));
        }
      }
    }
  };

  // payoffDatesMemo takes care of forecasting now

  const cerrarMes = () => {
    if (!window.confirm("¿Seguro que quieres CERRAR EL MES? Esto aplicará los pagos realizados a tus deudas y reiniciará el check de tareas.")) return;

    let newDebts = [...debts];
    const allTasks = [...q1Tasks, ...q2Tasks];

    // Snapshot variables para el historial
    let principalPagado = 0;
    let interesPagado = 0;

    // 0. Aplicar interes compuesto
    newDebts = newDebts.map(d => {
      if (d.balance > 0) {
        const interesMonto = d.balance * ((d.apr || 0) / 100 / 12);
        interesPagado += interesMonto;
        return { ...d, balance: d.balance + interesMonto };
      }
      return d;
    });

    // 1. Aplicar pagos normales y mínimos
    allTasks.forEach(t => {
      if (t.done && t.type === 'debt-min' && t.debtId) {
        const dIndex = newDebts.findIndex(d => d.id === t.debtId);
        if (dIndex !== -1 && newDebts[dIndex].balance > 0) {
          const pagoEfectivo = (t.amount - (t.adelanto || 0));
          principalPagado += pagoEfectivo;
          newDebts[dIndex].balance = Math.max(0, newDebts[dIndex].balance - pagoEfectivo);
        }
      }
    });

    // 2. Calcular fondo Snowball (excedentes fijos + side hustles)
    let snowballMonto = totalSideHustle;
    allTasks.forEach(t => {
      if (t.done && t.type === 'snowball') {
        const pagoEfectivo = (t.amount - (t.adelanto || 0));
        snowballMonto += pagoEfectivo;
      }
    });

    // Añadir lo que sobró directo a registro principal pagado total (simplificado)
    principalPagado += snowballMonto;

    // 3. Aplicar bola de nieve en cascada
    for (let i = 0; i < newDebts.length; i++) {
      if (snowballMonto <= 0) break;
      if (newDebts[i].balance > 0) {
        if (snowballMonto >= newDebts[i].balance) {
          snowballMonto -= newDebts[i].balance;
          newDebts[i].balance = 0; // Saldada!
        } else {
          newDebts[i].balance -= snowballMonto;
          snowballMonto = 0;
        }
      }
    }

    // 4. Guardar Historial del mes
    const montoTotalResta = newDebts.reduce((acc, curr) => acc + curr.balance, 0);
    const snapshotObj = {
      id: Date.now(),
      fecha: new Date().toLocaleDateString(),
      totalPagado: principalPagado,
      totalInteres: interesPagado,
      sideHustlesMonto: totalSideHustle,
      deudaRestante: montoTotalResta,
      detalleDeudas: newDebts.map(d => ({ nombre: d.name, balance: d.balance }))
    };
    setHistory([snapshotObj, ...history]);

    setDebts(newDebts);
    setQ1Tasks(q1Tasks.map(t => ({ ...t, done: false, adelanto: 0 })));
    setQ2Tasks(q2Tasks.map(t => ({ ...t, done: false, adelanto: 0 })));
    setSideHustles([]);

    triggerConfetti();
    alert("¡Mes cerrado exitosamente! El historial y las deudas han sido actualizadas.");
  };

  const addSideHustle = (e) => {
    e.preventDefault();
    if (!newHustleDesc || !newHustleAmount) return;

    setSideHustles([...sideHustles, {
      id: Date.now(),
      desc: newHustleDesc,
      amount: parseFloat(newHustleAmount),
      date: new Date().toLocaleDateString()
    }]);
    setNewHustleDesc('');
    setNewHustleAmount('');
    triggerConfetti();
  };

  const deleteSideHustle = (id) => {
    setSideHustles(sideHustles.filter(s => s.id !== id));
  }

  const updateDueDay = (type, id) => {
    let item, val;
    let list, setList;
    if (type === 'income') {
      item = incomes.find(i => i.id === id); list = incomes; setList = setIncomes;
    } else if (type === 'expense') {
      item = expenses.find(e => e.id === id); list = expenses; setList = setExpenses;
    } else if (type === 'debt') {
      item = debts.find(d => d.id === id); list = debts; setList = setDebts;
    }

    if (item) {
      val = window.prompt(`Actualizar fecha/día para ${item.name} (Ej: '15', 'Viernes', 'Semanal', '12 y 26'):`, item.dueDay || '');
      if (val !== null) {
        if (val.trim() !== '') {
          setList(list.map(x => x.id === id ? { ...x, dueDay: val.trim() } : x));
        } else {
          setList(list.map(x => x.id === id ? { ...x, dueDay: '' } : x));
        }
      }
    }
  };


  // ================= UI RENDERERS =================

  const getThemeClass = () => {
    if (racha >= 2 || totalSideHustle > 200) return 'bg-slate-950 selection:bg-emerald-500/30 ring-1 ring-inset ring-emerald-500/10';
    return 'bg-slate-950 selection:bg-indigo-500/30';
  }

  const renderChecklist = (tasks, quincena) => {
    const progress = Math.round((tasks.filter(t => t.done).length / tasks.length) * 100);
    const isCompleted = progress === 100;

    return (
      <div className={`p-5 md:p-6 rounded-3xl border transition-all duration-300 backdrop-blur-sm ${isCompleted ? 'bg-emerald-900/10 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-400" />
            Quincena {quincena}
          </h3>
          <span className={`text-sm font-bold px-3 py-1 rounded-full ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-emerald-400'}`}>
            {progress}% Listo
          </span>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-2 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="space-y-3">
          {tasks.map(task => {
            const effectiveAmount = task.amount - (task.adelanto || 0);
            const isSnowball = task.type === 'snowball' || task.type === 'debt-min';
            return (
              <div
                key={task.id}
                onClick={() => toggleTask(quincena, task.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${task.done
                  ? 'bg-slate-900/50 border-slate-800 opacity-50'
                  : task.type === 'income'
                    ? 'bg-blue-900/20 border-blue-800/50 hover:bg-blue-900/40'
                    : isSnowball
                      ? 'bg-indigo-900/20 border-indigo-800/50 hover:bg-indigo-900/40'
                      : (task.type === 'variable' && (task.adelanto || 0) > task.amount)
                        ? 'bg-red-900/20 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                        : 'bg-slate-800 border-slate-700 hover:bg-slate-700'
                  }`}
              >
                <div className="flex items-center gap-3">
                  {task.done ? (
                    <CheckSquare className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                  <span className={`text-sm font-medium ${task.done ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                    {task.isDynamic ? `${task.text} ${activeDebt.name}` : task.text}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {task.type !== 'income' && !task.done && (
                    <button
                      onClick={(e) => handleAdelanto(e, quincena, task.id)}
                      className="text-slate-500 hover:text-emerald-400 p-1"
                      title="Ingresar Adelanto / Deducción"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="text-right">
                    <span className={`text-sm font-bold flex items-center gap-1.5 ${task.done
                      ? 'text-slate-500'
                      : task.type === 'income'
                        ? 'text-blue-400'
                        : isSnowball ? 'text-indigo-400' : 'text-slate-300'
                      }`}>
                      {task.type === 'income' ? '+' : '-'}${effectiveAmount}
                    </span>
                    {task.adelanto > 0 && (
                      <span className={`text-[10px] mt-0.5 block font-bold ${task.adelanto > task.amount ? 'text-red-400' : 'text-emerald-500'}`}>
                        {task.adelanto > task.amount ? '¡Sobregiro!: ' : 'Adelanto: '}${task.adelanto}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen text-slate-300 font-sans pb-20 transition-colors duration-1000 ${getThemeClass()}`}>

      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-6 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2 tracking-tight">
              <Target className="w-6 h-6 text-emerald-500" />
              Plan Financiero <span className="text-emerald-500">2026</span>
            </h1>
            <div className="flex items-center gap-3 mt-1 5">
              <p className="text-slate-400 text-sm flex items-center gap-1 font-medium bg-slate-800/30 px-3 py-1 rounded-full border border-slate-700/50">
                <Flame className="w-4 h-4 text-orange-500" /> <span className="text-white font-bold">{racha}</span>
              </p>

              {/* Achievement Badges */}
              <div className="flex gap-1">
                {achievements.firstQPerfect && <span title="1er Paso: Quincena Invicta" className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Trophy className="w-3 h-3" /> 1er Logro</span>}
                {achievements.debtDestroyer && <span title="Destructor: $500+ Extras" className="bg-indigo-500/20 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles className="w-3 h-3" /> Destructor</span>}
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 w-auto gap-1">
            {['contable', 'dashboard', 'fechas', 'historial', 'bolsillos'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all capitalize ${activeTab === tab ? 'bg-emerald-500/20 text-emerald-400 shadow-xl shadow-emerald-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
              >
                {tab === 'contable' && <CheckSquare className="w-4 h-4" />}
                {tab === 'dashboard' && <LayoutDashboard className="w-4 h-4" />}
                {tab === 'fechas' && <Calendar className="w-4 h-4" />}
                {tab === 'historial' && <History className="w-4 h-4" />}
                {tab === 'bolsillos' && <Briefcase className="w-4 h-4" />}
                <span className="hidden lg:inline">{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-6 mt-6">

        {/* ================= VISTA: MI CONTABLE ================= */}
        {activeTab === 'contable' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start bg-indigo-900/20 border border-indigo-500/30 text-indigo-300 p-4 rounded-xl text-sm gap-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p><strong>Meta Activa: {activeDebt.name}</strong>. Cierra el mes cuando ambas quincenas estén listas para abonar todo el progreso de excedentes a las deudas.</p>
              </div>
              <button
                onClick={cerrarMes}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors w-full sm:w-auto font-bold shadow-lg shadow-indigo-500/20"
              >
                <AlertCircle className="w-4 h-4" /> Cierre de Mes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderChecklist(q1Tasks, 1)}
              {renderChecklist(q2Tasks, 2)}
            </div>

            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 p-8 rounded-3xl text-center relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-emerald-900/10">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[60px]"></div>

              <div className="text-left flex-1 z-10 w-full">
                <h3 className="text-emerald-300 font-bold mb-2 uppercase tracking-wider text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" /> Fuego contra {activeDebt.name}
                </h3>
                <p className="text-4xl md:text-5xl font-black text-emerald-400 tracking-tighter shadow-emerald-500/20 drop-shadow-lg">
                  ${poderAtaqueActiva}
                </p>
                <div className="mt-4 pt-4 border-t border-emerald-500/20 text-xs text-emerald-300/80 flex flex-col gap-1.5 font-medium">
                  <div className="flex justify-between items-center gap-2">
                    <span>Manteniendo otras deudas:</span>
                    <span className="font-mono text-emerald-100">${totalMinimosOtras}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2 text-emerald-400 font-bold">
                    <span>Poder de Destrucción Total:</span>
                    <span className="font-mono">${poderTotalDeudas}</span>
                  </div>
                </div>
              </div>

              {/* Side Hustle Component */}
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-5 rounded-2xl w-full md:w-80 shadow-2xl z-10 flex-shrink-0">
                <h4 className="font-bold text-slate-200 mb-4 flex items-center gap-2 text-sm"><PlusCircle className="w-4 h-4 text-emerald-400" /> Activar Ingreso Extra</h4>

                <form onSubmit={addSideHustle} className="space-y-3">
                  <input
                    type="text" required
                    value={newHustleDesc} onChange={e => setNewHustleDesc(e.target.value)}
                    placeholder="Ej. Uber, Venta..."
                    className="w-full bg-slate-900/50 text-sm border-slate-700/50 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                  />
                  <div className="flex gap-2">
                    <span className="bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 text-slate-400 flex items-center justify-center font-bold">$</span>
                    <input
                      type="number" required min="1" step="0.01"
                      value={newHustleAmount} onChange={e => setNewHustleAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-900/50 text-sm border-slate-700/50 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-mono"
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-sm transition-all mt-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                    Inyectar Fuego
                  </button>
                </form>

                {sideHustles.length > 0 && (
                  <div className="mt-4 max-h-32 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {sideHustles.map(h => (
                      <div key={h.id} className="flex justify-between items-center text-xs bg-slate-800/50 p-2 rounded border border-slate-700/50">
                        <span className="text-slate-300 truncate pr-2">{h.desc}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-emerald-400 font-bold">+${h.amount}</span>
                          <button onClick={() => deleteSideHustle(h.id)} className="text-slate-500 hover:text-red-400">&times;</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= VISTA: DASHBOARD / CALCULADORA ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Progreso Global Dinamica */}
            <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
              {achievements.debtDestroyer && <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>}
              <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Misión Principal Deuda: ${totalDebtBalance.toLocaleString()}
              </h2>
              <p className="text-sm text-slate-400 mb-6 flex items-center gap-2">
                Saldo original: <span className="line-through">${deudaTotalInicial.toLocaleString()}</span>
              </p>

              <div className="space-y-6">
                {debts.map((debt, i) => {
                  const isSaldada = debt.balance <= 0;
                  const isActiva = activeDebt.id === debt.id;
                  const pct = isSaldada ? 100 : Math.max(5, 100 - (debt.balance / debt.initial) * 100);

                  return (
                    <div key={debt.id} className="relative">
                      <div className="flex justify-between mb-2">
                        <div className="flex flex-col">
                          <span className={`font-semibold text-sm ${isSaldada ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                            {i + 1}. {debt.name} (${debt.balance.toLocaleString()})
                          </span>
                          {!isSaldada && (
                            <span className="text-[10px] text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-indigo-400" /> Meta Cero: {payoffDatesMemo[debt.id] || "---"}
                            </span>
                          )}
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded self-start ${isSaldada ? 'bg-emerald-500/10 text-emerald-500' :
                          isActiva ? 'bg-indigo-500/20 text-indigo-400 ring-1 ring-inset ring-indigo-500/50' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                          {isSaldada ? '¡Saldada!' : isActiva ? 'Objetivo Actual' : 'En Espera'}
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${isSaldada ? 'bg-emerald-500' :
                          isActiva ? 'bg-gradient-to-r from-indigo-600 to-indigo-400 relative' :
                            'bg-slate-600'
                          }`} style={{ width: `${pct}%` }}>
                          {isActiva && <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 animate-pulse rounded-full blur-sm"></div>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            {/* Meta RD */}
            <section className="bg-gradient-to-br from-blue-900/40 to-slate-900 p-6 rounded-2xl border border-blue-800/50">
              <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-400" />
                Viaje a RD (Meta: Julio - $2,000)
              </h2>
              <p className="text-sm text-blue-200/70 mb-4">
                Automático Walmart ($340) + Manual ($160) = $500/mes.
              </p>
              <div className="w-full bg-slate-800 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full relative" style={{ width: '60%' }}>
                  <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </section>

            {/* Calendario Resumido (Actualizado a enlazar Tab) */}
            <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Próximos Vencimientos
                </h2>
                <button
                  onClick={() => setActiveTab('fechas')}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
                >
                  Ver Calendario Completo
                </button>
              </div>
              <p className="text-sm text-slate-400">Dirígete a la pestaña "Fechas" en el menú para configurar todos los días de cobro y pagos.</p>
            </section>

            {/* Gráfica de Distribución (NUEVO) */}
            <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
              <h2 className="text-xl font-bold mb-4 text-white flex items-center justify-center gap-2">
                <PieChartIcon className="w-5 h-5 text-indigo-400" />
                Distribución de Presupuesto (Base)
              </h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[
                      { name: 'Gastos Fijos', value: expenses.reduce((a, c) => a + c.amount, 0) },
                      { name: 'Abono Deudas', value: totalMinimosOtras + poderAtaqueActiva },
                      { name: 'Variables/Ahorro', value: Math.max(0, totalIncome - expenses.reduce((a, c) => a + c.amount, 0) - (totalMinimosOtras + poderAtaqueActiva)) }
                    ]} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      <Cell fill="#3b82f6" />
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#cbd5e1' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Rastreador Fondo de Emergencia (NUEVO) */}
            {(() => {
              const costoVidaMes = expenses.reduce((acc, curr) => acc + curr.amount, 0);
              const metaEmergencia3Meses = costoVidaMes * 3;
              const fondoActualVal = wallets.find(w => w.id === 'ahorros')?.balance || 0;
              const pctEmergencia = Math.min(100, (fondoActualVal / metaEmergencia3Meses) * 100);

              return (
                <section className="bg-gradient-to-br from-indigo-900/40 to-slate-900 p-6 rounded-2xl border border-indigo-800/50">
                  <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    Fondo de Emergencia (3 Meses)
                  </h2>
                  <div className="flex justify-between text-sm text-indigo-200/70 mb-4">
                    <span>Actual: ${fondoActualVal.toLocaleString()}</span>
                    <span>Meta: ${metaEmergencia3Meses.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-700">
                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full relative transition-all duration-1000" style={{ width: `${pctEmergencia}%` }}>
                      <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/20 animate-pulse rounded-full blur-sm"></div>
                    </div>
                  </div>
                </section>
              );
            })()}

            {/* Simulador WhatIf (NUEVO) */}
            <section className="bg-slate-900 p-6 rounded-2xl border border-slate-800 relative z-10">
              <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-fuchsia-400" />
                Máquina del Tiempo (Simulador)
              </h2>
              <p className="text-sm text-slate-400 mb-4">¿Qué pasaría si añades un extra constante a tus pagos mensuales?</p>

              <div className="flex gap-2 mb-6">
                <span className="bg-slate-800 border border-slate-700 rounded-xl px-4 text-slate-400 flex items-center justify-center font-bold">$</span>
                <input
                  type="number"
                  placeholder="Inyección extra recurrente"
                  value={whatIfInput}
                  onChange={(e) => setWhatIfInput(e.target.value)}
                  className="flex-1 bg-slate-800 text-sm border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all font-mono"
                />
                <button
                  onClick={() => setWhatIfExtra(Number(whatIfInput) || 0)}
                  className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(192,38,211,0.3)]"
                >
                  Simular
                </button>
              </div>

              {whatIfExtra > 0 && (
                <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                  <h3 className="text-sm font-bold text-fuchsia-300">Nuevas Fechas Estimadas (vs Actual):</h3>
                  {debts.map(d => {
                    const actualDate = payoffDatesMemo[d.id] || "---";
                    const newDate = whatIfDatesMemo[d.id] || "---";
                    if (d.balance <= 0) return null;
                    return (
                      <div key={'sim-' + d.id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                        <span className="text-sm text-slate-200 font-medium">{d.name}</span>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="text-slate-500 line-through">{actualDate}</span>
                          <ArrowRight className="w-4 h-4 text-fuchsia-500" />
                          <span className="text-fuchsia-400 font-bold bg-fuchsia-500/10 px-2 py-1 rounded">{newDate}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

          </div>
        )}

        {/* ================= VISTA: FECHAS / CALENDARIO ================= */}
        {activeTab === 'fechas' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
              <Calendar className="w-6 h-6 text-indigo-400" /> Calendario Maestro
            </h2>
            <p className="text-sm text-slate-400 mb-6">Administra qué día del mes caen tus ingresos y pagos para organizar mejor el cash-flow.</p>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              {(() => {
                // Combinar todos los items que tienen fecha
                const allItems = [
                  ...incomes.map(i => ({ ...i, tipo: 'income', label: i.name })),
                  ...debts.map(d => ({ ...d, tipo: 'debt', label: d.name })),
                  ...expenses.map(e => ({ ...e, tipo: 'expense', label: e.name }))
                ];

                // Agrupar
                let groupedNumbers = {};
                let textGroups = {};
                let withoutDate = [];

                allItems.forEach(item => {
                  const val = item.dueDay;
                  if (val === undefined || val === null || val.toString().trim() === '') {
                    withoutDate.push(item);
                    return;
                  }

                  const numDay = parseInt(val);
                  // Si es puramente un número del 1 al 31
                  if (!isNaN(numDay) && numDay > 0 && numDay <= 31 && numDay.toString() === val.toString().trim()) {
                    if (!groupedNumbers[numDay]) groupedNumbers[numDay] = [];
                    groupedNumbers[numDay].push(item);
                  } else {
                    // Es un texto libre, ej: 'Viernes', 'Semanal', '12 y 26'
                    const textKey = val.toString().trim();
                    if (!textGroups[textKey]) textGroups[textKey] = [];
                    textGroups[textKey].push(item);
                  }
                });

                return (
                  <div className="p-4 md:p-6 space-y-6">
                    {/* Items sin fecha */}
                    {withoutDate.length > 0 && (
                      <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-xl">
                        <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Sin día asignado</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {withoutDate.map(item => (
                            <button key={`no-date-${item.id}`} onClick={() => updateDueDay(item.tipo, item.id)} className="text-left bg-slate-950 border border-slate-800 p-3 rounded-lg hover:border-slate-600 transition group flex justify-between items-center">
                              <span className="text-sm text-slate-300">{item.label}</span>
                              <Edit3 className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timeline Flexible/Textual */}
                    {Object.keys(textGroups).length > 0 && Object.keys(textGroups).sort().map(texto => (
                      <div key={`text-${texto}`} className="flex flex-col md:flex-row gap-4 items-start relative border-l-2 border-indigo-500/50 ml-3 pl-6 py-2 mb-4">
                        <div className="absolute -left-[30px] top-4 rounded-full bg-slate-900 border-2 border-indigo-500/50 px-3 py-1 flex items-center justify-center font-bold text-indigo-300 text-xs shadow-lg z-10">
                          {texto}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full ml-4 md:ml-12">
                          {textGroups[texto].map(item => (
                            <button
                              key={`item-${item.id}`}
                              onClick={() => updateDueDay(item.tipo, item.id)}
                              className={`text-left p-3 rounded-xl border relative overflow-hidden group transition hover:scale-[1.02] ${item.tipo === 'income' ? 'bg-emerald-900/10 border-emerald-500/30' :
                                  item.tipo === 'debt' ? 'bg-indigo-900/10 border-indigo-500/30' :
                                    'bg-slate-800/50 border-slate-700/50'
                                }`}
                            >
                              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition">
                                <Edit3 className="w-4 h-4 text-slate-400" />
                              </div>
                              <span className={`text-[10px] uppercase font-bold tracking-widest ${item.tipo === 'income' ? 'text-emerald-500' :
                                  item.tipo === 'debt' ? 'text-indigo-400' :
                                    'text-slate-400'
                                }`}>
                                {item.tipo === 'income' ? 'Ingreso' : item.tipo === 'debt' ? 'Deuda' : 'Gasto Fijo'}
                              </span>
                              <p className="text-sm font-medium text-slate-200 mt-1">{item.label}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Timeline por días */}
                    <div className="grid gap-4">
                      {Object.keys(groupedNumbers).sort((a, b) => parseInt(a) - parseInt(b)).map(day => (
                        <div key={`day-${day}`} className="flex flex-col md:flex-row gap-4 items-start relative border-l-2 border-slate-800 ml-3 pl-6 py-2">
                          <div className="absolute -left-[17px] top-4 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center font-black text-slate-300">
                            {day}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
                            {groupedNumbers[day].map(item => (
                              <button
                                key={`item-${item.id}`}
                                onClick={() => updateDueDay(item.tipo, item.id)}
                                className={`text-left p-3 rounded-xl border relative overflow-hidden group transition hover:scale-[1.02] ${item.tipo === 'income' ? 'bg-emerald-900/10 border-emerald-500/30' :
                                  item.tipo === 'debt' ? 'bg-indigo-900/10 border-indigo-500/30' :
                                    'bg-slate-800/50 border-slate-700/50'
                                  }`}
                              >
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition">
                                  <Edit3 className="w-4 h-4 text-slate-400" />
                                </div>
                                <span className={`text-[10px] uppercase font-bold tracking-widest ${item.tipo === 'income' ? 'text-emerald-500' :
                                  item.tipo === 'debt' ? 'text-indigo-400' :
                                    'text-slate-400'
                                  }`}>
                                  {item.tipo === 'income' ? 'Ingreso' : item.tipo === 'debt' ? 'Deuda' : 'Gasto Fijo'}
                                </span>
                                <p className="text-sm font-medium text-slate-200 mt-1">{item.label}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* ================= VISTA: HISTORIAL ================= */}
        {activeTab === 'historial' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <History className="w-6 h-6 text-indigo-400" /> Archivo Mensual
              </h2>
              <button
                onClick={() => {
                  if (history.length === 0) return alert('No hay historial para exportar.');
                  const headers = "ID,Fecha,Total_Abonado_Principal,Intereses_Pagados,SideHustles,Deuda_Restante\n";
                  const rows = history.map(h => `${h.id},${h.fecha},${h.totalPagado},${h.totalInteres.toFixed(2)},${h.sideHustlesMonto},${h.deudaRestante}`).join("\n");
                  const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", "historial_financiero_2026.csv");
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors text-sm font-bold border border-slate-700 shadow-lg"
              >
                <Download className="w-4 h-4" /> Exportar CSV
              </button>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-3xl">
                <History className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-400">Sin historial aún</h3>
                <p className="text-slate-500 mt-2">Cierra tu primer mes para ver los registros aquí.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map(record => (
                  <div key={record.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/30 transition-colors shadow-lg">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
                      <span className="font-bold text-white flex items-center gap-2"><Calendar className="w-4 h-4 text-emerald-400" /> {record.fecha}</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-3 py-1 rounded-full font-mono">Cierre: #{record.id.toString().slice(-4)}</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-slate-500 text-xs mb-1">Abonado a Capital</p>
                        <p className="text-emerald-400 font-bold text-lg">${record.totalPagado.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-slate-500 text-xs mb-1">Interés Generado</p>
                        <p className="text-red-400 font-bold text-lg">${record.totalInteres.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-slate-500 text-xs mb-1">Side Hustles Mes</p>
                        <p className="text-indigo-400 font-bold text-lg">${record.sideHustlesMonto.toLocaleString()}</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-slate-500 text-xs mb-1">Deuda Restante</p>
                        <p className="text-slate-300 font-bold text-lg">${record.deudaRestante.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= VISTA: BOLSILLOS (WALLETS) ================= */}
        {activeTab === 'bolsillos' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
              <Briefcase className="w-6 h-6 text-emerald-400" /> Control de Cuentas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wallets.map((wallet, idx) => (
                <div key={wallet.id} className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-xl">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-800/50 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>

                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <h3 className="font-bold text-slate-300 text-lg flex items-center gap-2">
                      {wallet.id === 'cheques' && <Briefcase className="w-5 h-5 text-blue-400" />}
                      {wallet.id === 'ahorros' && <PiggyBank className="w-5 h-5 text-fuchsia-400" />}
                      {wallet.id === 'efectivo' && <Wallet className="w-5 h-5 text-emerald-400" />}
                      {wallet.name}
                    </h3>
                  </div>

                  <div className="mb-6 relative z-10">
                    <p className="text-4xl font-black text-white tracking-tighter shadow-black/50 drop-shadow-md">
                      ${wallet.balance.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2 relative z-10">
                    <button
                      onClick={() => {
                        const val = window.prompt("Ingresar monto a SUMAR a " + wallet.name + ":", "0");
                        if (val && !isNaN(val)) {
                          const newWallets = [...wallets];
                          newWallets[idx].balance += parseFloat(val);
                          setWallets(newWallets);
                        }
                      }}
                      className="flex-1 bg-slate-800 hover:bg-emerald-500/20 text-emerald-400 font-bold py-2 rounded-xl transition-all border border-slate-700 hover:border-emerald-500/50"
                    >+</button>
                    <button
                      onClick={() => {
                        const val = window.prompt("Ingresar monto a RESTAR a " + wallet.name + ":", "0");
                        if (val && !isNaN(val)) {
                          const newWallets = [...wallets];
                          newWallets[idx].balance = Math.max(0, newWallets[idx].balance - parseFloat(val));
                          setWallets(newWallets);
                        }
                      }}
                      className="flex-1 bg-slate-800 hover:bg-red-500/20 text-red-400 font-bold py-2 rounded-xl transition-all border border-slate-700 hover:border-red-500/50"
                    >-</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-sm text-slate-400 flex items-start gap-3 mt-6">
              <AlertCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <p>Tu Liquidez Total entre todas las cuentas actuales es de <strong className="text-white">${wallets.reduce((a, c) => a + c.balance, 0).toLocaleString()}</strong>. Recuerda usar el simulador de deudas en el Dashboard si decides inyectar dinero extra proveniente de tus ahorros a las deudas.</p>
            </div>
          </div>
        )}

      </main>

      <footer className="max-w-4xl mx-auto p-6 mt-8 mb-24 md:mb-8 text-center text-slate-500 text-sm">
        <p>
          by fernely 2026 • <a href="https://fernelydev.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">fernelydev.com</a>
        </p>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-2 pb-5 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/70">
        <div className="flex justify-around items-center">
          {['contable', 'dashboard', 'fechas', 'historial', 'bolsillos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex flex-col items-center justify-center w-full py-2 gap-1 rounded-xl transition-all ${activeTab === tab ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500'}`}
            >
              {tab === 'contable' && <CheckSquare className="w-5 h-5" />}
              {tab === 'dashboard' && <LayoutDashboard className="w-5 h-5" />}
              {tab === 'fechas' && <Calendar className="w-5 h-5" />}
              {tab === 'historial' && <History className="w-5 h-5" />}
              {tab === 'bolsillos' && <Briefcase className="w-5 h-5" />}
              <span className="text-[10px] font-bold capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </div>
  );
};

export default App;
