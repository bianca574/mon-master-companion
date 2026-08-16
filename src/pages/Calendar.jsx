import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadPrograms } from '../utils/storage';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

function toDateKey(date) {
    return date.toISOString().slice(0, 10);
}

function buildMonthGrid(year, month) {
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
}

function Calendar() {
    const navigate = useNavigate();
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    useEffect(() => {
        loadPrograms().then((data) => {
            setPrograms(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div style={{ padding: '2rem', color: 'var(--color-text-secondary)' }}>Chargement...</div>;
    }

    const deadlinesByDate = {};
    programs.forEach((p) => {
        if (!p.deadline) return;
        const key = p.deadline.slice(0, 10);
        if (!deadlinesByDate[key]) deadlinesByDate[key] = [];
        deadlinesByDate[key].push(p);
    });

    const weeks = buildMonthGrid(year, month);
    const monthLabel = new Date(year, month, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const todayKey = toDateKey(today);

    function goPrevMonth() {
        if (month === 0) { setMonth(11); setYear((y) => y - 1); } else { setMonth((m) => m - 1); }
    }

    function goNextMonth() {
        if (month === 11) { setMonth(0); setYear((y) => y + 1); } else { setMonth((m) => m + 1); }
    }

    return (
        <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ color: 'var(--color-primary)', textTransform: 'capitalize' }}>{monthLabel}</h1>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={goPrevMonth}>←</button>
                    <button onClick={goNextMonth}>→</button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem', marginBottom: '0.5rem' }}>
                {WEEKDAYS.map((d) => (
                    <div key={d} style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>{d}</div>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {weeks.map((week, wi) => (
                    <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.4rem' }}>
                        {week.map((date, di) => {
                            if (!date) return <div key={di} />;
                            const key = toDateKey(date);
                            const dayDeadlines = deadlinesByDate[key] || [];
                            const isToday = key === todayKey;

                            return (
                                <div
                                    key={di}
                                    style={{
                                        minHeight: 70,
                                        background: 'var(--color-surface)',
                                        border: isToday ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '0.35rem',
                                    }}
                                >
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{date.getDate()}</div>
                                    {dayDeadlines.map((p) => (
                                        <div
                                            key={p.id}
                                            onClick={() => navigate(`/programs/${p.id}`)}
                                            style={{
                                                background: 'var(--color-secondary)',
                                                color: '#fff',
                                                borderRadius: 4,
                                                fontSize: '0.7rem',
                                                padding: '1px 4px',
                                                marginTop: '3px',
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                            title={`${p.university} — ${p.programName}`}
                                        >
                                            {p.programName}, {p.university}
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Calendar;