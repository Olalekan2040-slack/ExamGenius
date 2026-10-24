// GuidedLearn.jsx — Objective-by-Objective Learning Flow
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import Layout from '../components/Layout';
import * as api from '../api';

// ============================================================
// STATIC CONTENT REGISTRY
// ============================================================

function hasStaticContent(subject, topic) {
  if (subject === 'Physics') {
    if (window.PHYSICS_LEARNING_CONTENT && window.PHYSICS_LEARNING_CONTENT[topic]) return true;
    if (topic === 'Motion' && window.MOTION_LEARNING_CONTENT) return true;
  }
  if (subject === 'Chemistry' && window.CHEMISTRY_LEARNING_CONTENT && window.CHEMISTRY_LEARNING_CONTENT[topic]) return true;
  if (subject === 'Mathematics' && window.MATHEMATICS_LEARNING_CONTENT && window.MATHEMATICS_LEARNING_CONTENT[topic]) return true;
  if (subject === 'Government' && window.GOVERNMENT_LEARNING_CONTENT && window.GOVERNMENT_LEARNING_CONTENT[topic]) return true;
  if (subject === 'English' && window.ENGLISH_LEARNING_CONTENT && window.ENGLISH_LEARNING_CONTENT[topic]) return true;
  if (subject === 'Biology' && window.BIOLOGY_LEARNING_CONTENT && window.BIOLOGY_LEARNING_CONTENT[topic]) return true;
  if (subject === 'Geography' && window.GEOGRAPHY_LEARNING_CONTENT && window.GEOGRAPHY_LEARNING_CONTENT[topic]) return true;
  if (subject === 'Economics' && window.ECONOMICS_LEARNING_CONTENT && window.ECONOMICS_LEARNING_CONTENT[topic]) return true;
  if (subject === 'Commerce' && window.COMMERCE_LEARNING_CONTENT && window.COMMERCE_LEARNING_CONTENT[topic]) return true;
  if (subject === 'Accounting' && window.ACCOUNTING_LEARNING_CONTENT && window.ACCOUNTING_LEARNING_CONTENT[topic]) return true;
  if (subject === 'Literature in English' && window.LITERATURE_LEARNING_CONTENT && window.LITERATURE_LEARNING_CONTENT[topic]) return true;
  return false;
}

function getStaticTopicContent(subject, topic) {
  if (subject === 'Physics') {
    if (topic === 'Motion' && window.MOTION_LEARNING_CONTENT) return window.MOTION_LEARNING_CONTENT;
    if (window.PHYSICS_LEARNING_CONTENT && window.PHYSICS_LEARNING_CONTENT[topic]) return window.PHYSICS_LEARNING_CONTENT[topic];
  }
  if (subject === 'Chemistry' && window.CHEMISTRY_LEARNING_CONTENT && window.CHEMISTRY_LEARNING_CONTENT[topic]) return window.CHEMISTRY_LEARNING_CONTENT[topic];
  if (subject === 'Mathematics' && window.MATHEMATICS_LEARNING_CONTENT && window.MATHEMATICS_LEARNING_CONTENT[topic]) return window.MATHEMATICS_LEARNING_CONTENT[topic];
  if (subject === 'Government' && window.GOVERNMENT_LEARNING_CONTENT && window.GOVERNMENT_LEARNING_CONTENT[topic]) return window.GOVERNMENT_LEARNING_CONTENT[topic];
  if (subject === 'Biology' && window.BIOLOGY_LEARNING_CONTENT && window.BIOLOGY_LEARNING_CONTENT[topic]) return window.BIOLOGY_LEARNING_CONTENT[topic];
  if (subject === 'English' && window.ENGLISH_LEARNING_CONTENT && window.ENGLISH_LEARNING_CONTENT[topic]) return window.ENGLISH_LEARNING_CONTENT[topic];
  if (subject === 'Geography' && window.GEOGRAPHY_LEARNING_CONTENT && window.GEOGRAPHY_LEARNING_CONTENT[topic]) return window.GEOGRAPHY_LEARNING_CONTENT[topic];
  if (subject === 'Economics' && window.ECONOMICS_LEARNING_CONTENT && window.ECONOMICS_LEARNING_CONTENT[topic]) return window.ECONOMICS_LEARNING_CONTENT[topic];
  if (subject === 'Commerce' && window.COMMERCE_LEARNING_CONTENT && window.COMMERCE_LEARNING_CONTENT[topic]) return window.COMMERCE_LEARNING_CONTENT[topic];
  if (subject === 'Accounting' && window.ACCOUNTING_LEARNING_CONTENT && window.ACCOUNTING_LEARNING_CONTENT[topic]) return window.ACCOUNTING_LEARNING_CONTENT[topic];
  if (subject === 'Literature in English' && window.LITERATURE_LEARNING_CONTENT && window.LITERATURE_LEARNING_CONTENT[topic]) return window.LITERATURE_LEARNING_CONTENT[topic];
  return null;
}

// ============================================================
// HELPER: build rich explanation HTML from AI response
// ============================================================

function buildRichExplanationHTML(explanation) {
  let html = '';
  if (explanation.explanation_html) {
    html += `<div class="rich-explanation-body">${explanation.explanation_html}</div>`;
  } else if (explanation.explanation) {
    html += `<div class="rich-explanation-body"><p>${explanation.explanation}</p></div>`;
  }
  if (explanation.svg_diagram) {
    html += `<div class="diagram-container"><div class="diagram-wrapper">${explanation.svg_diagram}</div>${explanation.diagram_caption ? `<p class="diagram-caption"><i class="fas fa-info-circle"></i> ${explanation.diagram_caption}</p>` : ''}</div>`;
  }
  if (explanation.key_points && explanation.key_points.length > 0) {
    html += `<div class="key-points-box"><h4><i class="fas fa-key"></i> Key Points</h4><ul>${explanation.key_points.map(p => `<li>${p}</li>`).join('')}</ul></div>`;
  }
  if (explanation.worked_example) {
    html += `<div class="worked-example-box"><h4><i class="fas fa-flask"></i> Worked Example</h4><div class="example-problem"><strong>Problem:</strong> ${explanation.worked_example.problem || ''}</div>${explanation.worked_example.solution_html ? `<div class="example-solution"><strong>Solution:</strong>${explanation.worked_example.solution_html}</div>` : ''}</div>`;
  } else if (explanation.example) {
    html += `<div class="worked-example-box"><h4><i class="fas fa-flask"></i> Example</h4><p>${explanation.example}</p></div>`;
  }
  if (explanation.common_mistakes && explanation.common_mistakes.length > 0) {
    html += `<div class="common-mistakes-box"><h4><i class="fas fa-exclamation-triangle"></i> Common Mistakes</h4><ul>${explanation.common_mistakes.map(m => `<li>${m}</li>`).join('')}</ul></div>`;
  }
  if (explanation.jamb_tip) {
    html += `<div class="jamb-tip-box"><h4><i class="fas fa-graduation-cap"></i> JAMB Tip</h4><p>${explanation.jamb_tip}</p></div>`;
  }
  if (explanation.summary) {
    html += `<div class="summary-box"><h4><i class="fas fa-compress-alt"></i> Summary</h4><p>${explanation.summary}</p></div>`;
  }
  return html;
}

function renderStaticVisualsHTML(visuals) {
  return visuals.map(visual => {
    switch (visual.type) {
      case 'icon-grid':
        return `<div class="icon-grid-visual">${visual.items.map(item => `<div class="icon-item"><div class="icon-circle"><i class="fas ${item.icon}"></i></div><div class="icon-label">${item.label}</div><div class="icon-desc">${item.description}</div></div>`).join('')}</div>`;
      case 'formula-cards': {
        const formulas = visual.formulas || visual.items || [];
        return `<div class="formula-cards">${formulas.map(f => `<div class="formula-item"><span class="formula">${f.formula}</span><span class="formula-use">${f.use}</span></div>`).join('')}</div>`;
      }
      case 'graph-comparison':
        return `<div class="graph-comparison">${visual.graphs.map(g => `<div class="graph-item"><div class="graph-placeholder"><i class="fas fa-chart-line"></i></div><div class="graph-title">${g.title}</div><div class="graph-desc">${g.description}</div></div>`).join('')}</div>`;
      case 'projectile-diagram':
        return `<div class="projectile-visual"><div class="projectile-diagram"><svg viewBox="0 0 400 200" class="projectile-svg"><defs><marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6"/></marker></defs><line x1="20" y1="180" x2="380" y2="180" stroke="#1E293B" stroke-width="2"/><path d="M 40 180 Q 200 20 360 180" stroke="#EAB308" stroke-width="3" fill="none" stroke-dasharray="8,4"/><circle cx="40" cy="180" r="8" fill="#10B981"/><circle cx="200" cy="50" r="6" fill="#3B82F6"/><circle cx="360" cy="180" r="8" fill="#EF4444"/><line x1="40" y1="180" x2="100" y2="120" stroke="#3B82F6" stroke-width="2" marker-end="url(#arrowhead)"/><text x="40" y="195" font-size="12" fill="#1E293B">Launch</text><text x="185" y="40" font-size="12" fill="#1E293B">Max Height</text><text x="340" y="195" font-size="12" fill="#1E293B">Landing</text></svg></div><div class="diagram-caption">${visual.caption || 'Projectile Motion Path'}</div></div>`;
      default:
        return '';
    }
  }).join('');
}

const SUBJECT_COLORS = {
  'Physics': { bg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', icon: '⚛️' },
  'Chemistry': { bg: 'linear-gradient(135deg, #10B981, #059669)', icon: '🧪' },
  'Biology': { bg: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', icon: '🧬' },
  'Mathematics': { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', icon: '📐' },
  'English': { bg: 'linear-gradient(135deg, #EC4899, #DB2777)', icon: '📚' },
  'Government': { bg: 'linear-gradient(135deg, #6366F1, #4F46E5)', icon: '🏛️' },
  'Economics': { bg: 'linear-gradient(135deg, #14B8A6, #0D9488)', icon: '📊' },
  'Literature in English': { bg: 'linear-gradient(135deg, #F472B6, #EC4899)', icon: '📖' },
  'Commerce': { bg: 'linear-gradient(135deg, #F97316, #EA580C)', icon: '💼' },
  'Accounting': { bg: 'linear-gradient(135deg, #22C55E, #16A34A)', icon: '🧮' },
  'Geography': { bg: 'linear-gradient(135deg, #0EA5E9, #0284C7)', icon: '🌍' },
};

const SUBJECTS_WITH_CONTENT = new Set([
  'Physics', 'Chemistry', 'Mathematics', 'Government', 'Biology',
  'English', 'Economics', 'Literature in English', 'Accounting', 'Commerce', 'Geography'
]);

export default function GuidedLearn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addToast } = useToast();

  // ── Core state ──────────────────────────────────────────────
  const [mode, setMode] = useState('subject-select');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Loading...');

  // Subject select
  const [subjects, setSubjects] = useState([]);

  // Topic list
  const [topicList, setTopicList] = useState([]);
  const [subject, setSubject] = useState(null);

  // Topic/Objective learning
  const [topicName, setTopicName] = useState(null);
  const [topicStructure, setTopicStructure] = useState(null);
  const [currentSubtopicIndex, setCurrentSubtopicIndex] = useState(0);
  const [currentObjectiveIndex, setCurrentObjectiveIndex] = useState(0);

  // Static learning
  const [useStaticContent, setUseStaticContent] = useState(false);
  const [staticContent, setStaticContent] = useState(null);
  const [staticStep, setStaticStep] = useState('learn'); // 'learn' | 'practice'
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [weaknesses, setWeaknesses] = useState([]);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeStaticQuestion, setActiveStaticQuestion] = useState(null);
  const [staticQuestionAnswered, setStaticQuestionAnswered] = useState(false);
  const [staticSelectedAnswer, setStaticSelectedAnswer] = useState(null);

  // Subtopic complete (static)
  const [subtopicJambQuestions, setSubtopicJambQuestions] = useState([]);
  const [subtopicJambIndex, setSubtopicJambIndex] = useState(0);
  const [subtopicJambAnswers, setSubtopicJambAnswers] = useState({});
  const [showJambQuiz, setShowJambQuiz] = useState(false);
  const [showNextSubtopicPreview, setShowNextSubtopicPreview] = useState(true);

  // Static topic complete
  const [totalPoints, setTotalPoints] = useState(0);
  const [topicCompleteBonus, setTopicCompleteBonus] = useState(0);
  const [topicScorePercent, setTopicScorePercent] = useState(0);
  const [customQuizCount, setCustomQuizCount] = useState(15);

  // Non-static (AI) objective learning
  const [currentObjective, setCurrentObjective] = useState(null);
  const [explanationHTML, setExplanationHTML] = useState('');
  const [explanationCollapsed, setExplanationCollapsed] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerResult, setAnswerResult] = useState(null);
  const [objectiveStep, setObjectiveStep] = useState('learn'); // 'learn' | 'practice'
  const timeStartedRef = useRef(null);

  // Subtopic complete (non-static)
  const [subtopicCompleteData, setSubtopicCompleteData] = useState(null);

  // Subtopic quiz (non-static)
  const [subtopicQuiz, setSubtopicQuiz] = useState(null);

  // Topic complete (non-static)
  const [topicCompleteWeaknesses, setTopicCompleteWeaknesses] = useState([]);

  // Topic overview (non-static)
  const [topicOverviewData, setTopicOverviewData] = useState(null);

  // Topic practice quiz (both modes share)
  const [topicQuizState, setTopicQuizState] = useState(null);
  const [topicQuizResultData, setTopicQuizResultData] = useState(null);

  // ── Initialise from navigation state ────────────────────────
  useEffect(() => {
    const params = location.state || {};
    if (params.subject && params.topic && params.subtopic !== undefined && params.objective !== undefined) {
      const st = getStaticTopicContent(params.subject, params.topic);
      setSubject(params.subject);
      setTopicName(params.topic);
      setCurrentSubtopicIndex(parseInt(params.subtopic));
      setCurrentObjectiveIndex(parseInt(params.objective));
      if (st) {
        setUseStaticContent(true);
        setStaticContent(st);
        setStaticStep('learn');
        setMode('static-learning');
      } else {
        loadTopicAndShowObjective(params.subject, params.topic, parseInt(params.subtopic), parseInt(params.objective));
      }
    } else if (params.subject && params.topic) {
      setSubject(params.subject);
      setTopicName(params.topic);
      const st = getStaticTopicContent(params.subject, params.topic);
      if (st) {
        setUseStaticContent(true);
        setStaticContent(st);
        loadStaticTopicProgress(params.subject, params.topic, st);
      } else {
        loadTopicProgress(params.subject, params.topic);
      }
    } else if (params.subject) {
      setSubject(params.subject);
      loadTopicList(params.subject);
    } else {
      loadSubjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Points notification ──────────────────────────────────────
  function showPointsNotification(points) {
    addToast(`+${points} Points!`, 'success');
  }

  // ── Award points ─────────────────────────────────────────────
  async function awardLearningPoints(params) {
    try {
      const response = await api.request('/guided-learn/award-points', {
        method: 'POST',
        requireAuth: true,
        body: {
          subject: params.subject,
          topic: params.topic,
          subtopic: params.subtopic || null,
          event_type: params.event_type,
          points: params.points,
          description: params.description || null,
        },
      });
      if (response.success) showPointsNotification(params.points);
      return response;
    } catch (e) {
      console.error('Failed to award points:', e);
      return null;
    }
  }

  // ============================================================
  // SUBJECT SELECT
  // ============================================================

  async function loadSubjects() {
    setLoading(true);
    setLoadingMsg('Loading subjects...');
    try {
      const data = await api.request('/guided-learn/subjects', { requireAuth: true });
      setSubjects(data.subjects || []);
      setMode('subject-select');
    } catch (e) {
      addToast('Failed to load subjects: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  function selectGuidedSubject(s) {
    setSubject(s);
    loadTopicList(s);
  }

  // ============================================================
  // TOPIC LIST
  // ============================================================

  async function loadTopicList(subj) {
    setLoading(true);
    setLoadingMsg(`Loading ${subj} topics...`);
    try {
      const data = await api.request(`/guided-learn/topics/${encodeURIComponent(subj)}`, { requireAuth: true });
      setTopicList(data.topics || []);
      setMode('topic-list');
    } catch (e) {
      addToast('Failed to load topics: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  function selectGuidedTopic(tName) {
    setTopicName(tName);
    const st = getStaticTopicContent(subject, tName);
    if (st) {
      setUseStaticContent(true);
      setStaticContent(st);
      loadStaticTopicProgress(subject, tName, st);
    } else {
      setUseStaticContent(false);
      setStaticContent(null);
      loadTopicProgress(subject, tName);
    }
  }

  // ============================================================
  // STATIC CONTENT FLOW
  // ============================================================

  function loadStaticTopicProgress(subj, tName, content) {
    const progressKey = `guided_progress_${subj}_${tName}`;
    const savedProgress = localStorage.getItem(progressKey);
    let stIdx = 0, objIdx = 0, answered = {}, weak = [], started = false;
    if (savedProgress) {
      const p = JSON.parse(savedProgress);
      stIdx = p.subtopicIndex || 0;
      objIdx = p.objectiveIndex || 0;
      answered = p.answered || {};
      weak = p.weaknesses || [];
      started = p.hasStarted || false;
    }
    setCurrentSubtopicIndex(stIdx);
    setCurrentObjectiveIndex(objIdx);
    setAnsweredQuestions(answered);
    setWeaknesses(weak);
    setHasStarted(started);

    const lastSt = content.subtopics.length - 1;
    const lastObj = content.subtopics[lastSt].objectives.length - 1;

    if (stIdx > lastSt || (stIdx === lastSt && objIdx > lastObj)) {
      showStaticTopicCompleteView(subj, tName, content, answered, weak);
    } else if (!started) {
      setMode('static-intro');
    } else {
      setStaticStep('learn');
      setStaticQuestionAnswered(false);
      setStaticSelectedAnswer(null);
      setActiveStaticQuestion(null);
      setMode('static-learning');
    }
  }

  function startStaticLearningFlow() {
    setHasStarted(true);
    setCurrentSubtopicIndex(0);
    setCurrentObjectiveIndex(0);
    const progressKey = `guided_progress_${subject}_${topicName}`;
    localStorage.setItem(progressKey, JSON.stringify({
      subtopicIndex: 0, objectiveIndex: 0, answered: {}, weaknesses: [], hasStarted: true, lastUpdated: Date.now()
    }));
    setStaticStep('learn');
    setStaticQuestionAnswered(false);
    setStaticSelectedAnswer(null);
    setActiveStaticQuestion(null);
    setMode('static-learning');
  }

  async function goToStaticPractice() {
    // fetch DB question for this subtopic/objective
    const subtopic = staticContent.subtopics[currentSubtopicIndex];
    const objective = subtopic.objectives[currentObjectiveIndex];
    const questionKey = `${currentSubtopicIndex}_${currentObjectiveIndex}`;
    const alreadyAnswered = answeredQuestions[questionKey];

    let dbQuestion = null;
    try {
      const qData = await api.request(
        `/guided-learn/questions/by-subtopic?subject=${encodeURIComponent(staticContent.subject)}&topic=${encodeURIComponent(staticContent.topic)}&subtopic=${encodeURIComponent(subtopic.name)}&limit=1`,
        { requireAuth: true }
      );
      if (qData.questions && qData.questions.length > 0) dbQuestion = qData.questions[0];
    } catch (e) { /* no-op */ }

    let question = null;
    if (dbQuestion && dbQuestion.options && Object.keys(dbQuestion.options).length >= 2) {
      question = {
        text: dbQuestion.question_text,
        options: dbQuestion.options,
        correctAnswer: dbQuestion.correct_option_key,
        explanation: dbQuestion.explanation || `The correct answer is ${dbQuestion.correct_option_key}.`,
        year: dbQuestion.year,
        isJamb: true,
      };
    } else if (objective.question) {
      question = objective.question;
    }

    setActiveStaticQuestion(question);
    setStaticQuestionAnswered(!!alreadyAnswered);
    setStaticSelectedAnswer(alreadyAnswered || null);
    setStaticStep('practice');
  }

  async function selectStaticOption(key) {
    if (staticQuestionAnswered) return;
    const question = activeStaticQuestion;
    if (!question) return;
    const correctAnswer = question.correctAnswer;
    const isCorrect = key === correctAnswer;

    setStaticQuestionAnswered(true);
    setStaticSelectedAnswer(key);

    const questionKey = `${currentSubtopicIndex}_${currentObjectiveIndex}`;
    const newAnswered = { ...answeredQuestions, [questionKey]: key };
    setAnsweredQuestions(newAnswered);

    let newWeaknesses = [...weaknesses];
    if (!isCorrect) {
      const subtopic = staticContent.subtopics[currentSubtopicIndex];
      const objective = subtopic.objectives[currentObjectiveIndex];
      newWeaknesses = [...newWeaknesses, {
        subtopicIndex: currentSubtopicIndex,
        objectiveIndex: currentObjectiveIndex,
        subtopicName: subtopic.name,
        objectiveTitle: objective.title,
      }];
      setWeaknesses(newWeaknesses);
    }

    const totalPoints = 10 + (isCorrect ? 5 : 0);
    await awardLearningPoints({
      subject: staticContent.subject,
      topic: staticContent.topic,
      subtopic: staticContent.subtopics[currentSubtopicIndex].name,
      event_type: isCorrect ? 'correct_answer' : 'objective_complete',
      points: totalPoints,
      description: `Completed: ${staticContent.subtopics[currentSubtopicIndex].objectives[currentObjectiveIndex].title}${isCorrect ? ' (correct!)' : ''}`,
    });

    // Save progress
    saveStaticProgressToDB(newAnswered, newWeaknesses, 'completed', isCorrect);
    const progressKey = `guided_progress_${subject}_${topicName}`;
    localStorage.setItem(progressKey, JSON.stringify({
      subtopicIndex: currentSubtopicIndex,
      objectiveIndex: currentObjectiveIndex,
      answered: newAnswered,
      weaknesses: newWeaknesses,
      hasStarted: true,
      lastUpdated: Date.now(),
    }));
  }

  async function saveStaticProgressToDB(answered, weak, status, answeredCorrectly) {
    try {
      const result = await api.request('/guided-learn/save-progress', {
        method: 'POST',
        requireAuth: true,
        body: {
          subject,
          topic: topicName,
          subtopic_index: currentSubtopicIndex,
          objective_index: currentObjectiveIndex,
          status,
          answered_correctly: answeredCorrectly,
          time_spent_seconds: 0,
        },
      });
      if (result && result.points_awarded > 0) showPointsNotification(result.points_awarded);
    } catch (e) { /* no-op */ }
  }

  function goToNextStaticObjective(stIdx, objIdx, answered, weak) {
    // Accept optional params so we can call after state updates
    const stI = stIdx !== undefined ? stIdx : currentSubtopicIndex;
    const objI = objIdx !== undefined ? objIdx : currentObjectiveIndex;
    const ans = answered || answeredQuestions;
    const wk = weak || weaknesses;
    const subtopic = staticContent.subtopics[stI];

    if (objI < subtopic.objectives.length - 1) {
      setCurrentObjectiveIndex(objI + 1);
      setCurrentSubtopicIndex(stI);
      saveLocalProgress(stI, objI + 1, ans, wk);
      setStaticStep('learn');
      setStaticQuestionAnswered(false);
      setStaticSelectedAnswer(null);
      setActiveStaticQuestion(null);
      setMode('static-learning');
    } else if (stI < staticContent.subtopics.length - 1) {
      // subtopic complete
      showStaticSubtopicCompleteView(stI, ans, wk);
    } else {
      showStaticTopicCompleteView(subject, topicName, staticContent, ans, wk);
    }
  }

  function goToPrevStaticObjective() {
    if (currentObjectiveIndex > 0) {
      setCurrentObjectiveIndex(currentObjectiveIndex - 1);
    } else if (currentSubtopicIndex > 0) {
      const prevSubtopic = staticContent.subtopics[currentSubtopicIndex - 1];
      setCurrentSubtopicIndex(currentSubtopicIndex - 1);
      setCurrentObjectiveIndex(prevSubtopic.objectives.length - 1);
    }
    setStaticStep('learn');
    setStaticQuestionAnswered(false);
    setStaticSelectedAnswer(null);
    setActiveStaticQuestion(null);
    setMode('static-learning');
  }

  function saveLocalProgress(stI, objI, ans, wk) {
    const progressKey = `guided_progress_${subject}_${topicName}`;
    localStorage.setItem(progressKey, JSON.stringify({
      subtopicIndex: stI, objectiveIndex: objI, answered: ans,
      weaknesses: wk, hasStarted: true, lastUpdated: Date.now()
    }));
  }

  async function showStaticSubtopicCompleteView(completedStIdx, ans, wk) {
    const completedSubtopic = staticContent.subtopics[completedStIdx];
    await awardLearningPoints({
      subject: staticContent.subject, topic: staticContent.topic,
      subtopic: completedSubtopic.name, event_type: 'subtopic_complete', points: 25,
      description: `Completed subtopic: ${completedSubtopic.name}`,
    });

    let jambQs = [];
    try {
      const qData = await api.request(
        `/guided-learn/questions/by-subtopic?subject=${encodeURIComponent(staticContent.subject)}&topic=${encodeURIComponent(staticContent.topic)}&subtopic=${encodeURIComponent(completedSubtopic.name)}&limit=5`,
        { requireAuth: true }
      );
      jambQs = qData.questions || [];
    } catch (e) { /* no-op */ }

    setSubtopicJambQuestions(jambQs);
    setSubtopicJambIndex(0);
    setSubtopicJambAnswers({});
    setShowJambQuiz(jambQs.length > 0);
    setShowNextSubtopicPreview(jambQs.length === 0);
    setMode('static-subtopic-complete');
  }

  function selectSubtopicJambAnswer(selectedKey, questionIndex) {
    const q = subtopicJambQuestions[questionIndex];
    const isCorrect = selectedKey === q.correct_option_key;
    setSubtopicJambAnswers(prev => ({ ...prev, [questionIndex]: { selected: selectedKey, isCorrect } }));
  }

  function continueToNextStaticSubtopic() {
    const nextStIdx = currentSubtopicIndex + 1;
    setCurrentSubtopicIndex(nextStIdx);
    setCurrentObjectiveIndex(0);
    saveLocalProgress(nextStIdx, 0, answeredQuestions, weaknesses);
    setStaticStep('learn');
    setStaticQuestionAnswered(false);
    setStaticSelectedAnswer(null);
    setActiveStaticQuestion(null);
    setMode('static-learning');
  }

  async function showStaticTopicCompleteView(subj, tName, content, ans, wk) {
    const totalQs = Object.keys(ans || {}).length;
    const weakCount = (wk || []).length;
    const correctCount = totalQs - weakCount;
    const scoreP = totalQs > 0 ? Math.round((correctCount / totalQs) * 100) : 100;
    const baseBonus = 50;
    const perfBonus = scoreP >= 80 ? 30 : scoreP >= 60 ? 15 : 0;
    const bonus = baseBonus + perfBonus;

    setTopicScorePercent(scoreP);
    setTopicCompleteBonus(bonus);

    await awardLearningPoints({
      subject: subj || subject, topic: tName || topicName, subtopic: null,
      event_type: 'topic_complete', points: bonus,
      description: `Completed topic: ${tName || topicName} (${scoreP}% score)`,
    });

    let pts = 0;
    try {
      const pointsData = await api.request('/guided-learn/points', { requireAuth: true });
      pts = pointsData.total_points || 0;
    } catch (e) { /* no-op */ }
    setTotalPoints(pts);

    const progressKey = `guided_progress_${subj || subject}_${tName || topicName}`;
    const saved = JSON.parse(localStorage.getItem(progressKey) || '{}');
    saved.completed = true; saved.completedAt = Date.now(); saved.finalScore = scoreP;
    localStorage.setItem(progressKey, JSON.stringify(saved));

    if (ans) setAnsweredQuestions(ans);
    if (wk) setWeaknesses(wk);
    setMode('static-topic-complete');
  }

  function restartStaticTopic() {
    const progressKey = `guided_progress_${subject}_${topicName}`;
    localStorage.removeItem(progressKey);
    setCurrentSubtopicIndex(0);
    setCurrentObjectiveIndex(0);
    setAnsweredQuestions({});
    setWeaknesses([]);
    setStaticStep('learn');
    setStaticQuestionAnswered(false);
    setStaticSelectedAnswer(null);
    setActiveStaticQuestion(null);
    setMode('static-learning');
  }

  function jumpToStaticWeakness(idx) {
    const w = weaknesses[idx];
    setCurrentSubtopicIndex(w.subtopicIndex);
    setCurrentObjectiveIndex(w.objectiveIndex);
    setStaticStep('learn');
    setStaticQuestionAnswered(false);
    setStaticSelectedAnswer(null);
    setActiveStaticQuestion(null);
    setMode('static-learning');
  }

  // ============================================================
  // NON-STATIC (AI) FLOW
  // ============================================================

  async function loadTopicProgress(subj, tName) {
    setLoading(true);
    setLoadingMsg('Loading your progress...');
    try {
      const structure = await api.request(
        `/guided-learn/topic/${encodeURIComponent(subj)}/${encodeURIComponent(tName)}`,
        { requireAuth: true }
      );
      setTopicStructure(structure.topic);

      await api.request(
        `/guided-learn/progress/${encodeURIComponent(subj)}/${encodeURIComponent(tName)}`,
        { requireAuth: true }
      );

      let foundNext = false;
      let nextSt = 0, nextObj = 0;
      for (let stI = 0; stI < structure.topic.subtopics.length; stI++) {
        const st = structure.topic.subtopics[stI];
        for (let oI = 0; oI < st.objectives.length; oI++) {
          if (st.objectives[oI].status !== 'completed') {
            nextSt = stI; nextObj = oI; foundNext = true; break;
          }
        }
        if (foundNext) break;
      }

      if (!foundNext) {
        await loadTopicComplete(subj, tName);
      } else {
        setCurrentSubtopicIndex(nextSt);
        setCurrentObjectiveIndex(nextObj);
        await loadObjectiveLearning(subj, tName, nextSt, nextObj, structure.topic);
      }
    } catch (e) {
      addToast('Failed to load topic: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadTopicAndShowObjective(subj, tName, stI, objI) {
    setLoading(true);
    setLoadingMsg('Loading...');
    try {
      const structure = await api.request(
        `/guided-learn/topic/${encodeURIComponent(subj)}/${encodeURIComponent(tName)}`,
        { requireAuth: true }
      );
      setTopicStructure(structure.topic);
      await loadObjectiveLearning(subj, tName, stI, objI, structure.topic);
    } catch (e) {
      addToast('Failed to load: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function loadObjectiveLearning(subj, tName, stI, objI, structure) {
    setLoading(true);
    setLoadingMsg('Loading objective...');
    try {
      const data = await api.request(
        `/guided-learn/objective/${encodeURIComponent(subj)}/${encodeURIComponent(tName)}/${stI}/${objI}`,
        { requireAuth: true }
      );
      setCurrentObjective(data);
      setQuestions(data.questions || []);
      setCurrentQuestionIndex(0);
      setQuestionAnswered(false);
      setSelectedAnswer(null);
      setAnswerResult(null);
      setObjectiveStep('learn');
      timeStartedRef.current = Date.now();

      let explanation = data.explanation;
      if (typeof explanation.explanation === 'string') {
        try { explanation = { ...data.explanation, ...JSON.parse(explanation.explanation) }; } catch (e) { /* no-op */ }
      }
      setExplanationHTML(buildRichExplanationHTML(explanation));
      setExplanationCollapsed(false);
      if (structure) setTopicStructure(structure);
      setMode('learning');
      saveObjectiveProgressToDB(subj, tName, stI, objI, 'in_progress', null, Date.now());
    } catch (e) {
      addToast('Failed to load objective: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function saveObjectiveProgressToDB(subj, tName, stI, objI, status, answeredCorrectly, startTime) {
    try {
      const timeSpent = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;
      await api.request('/guided-learn/save-progress', {
        method: 'POST',
        requireAuth: true,
        body: {
          subject: subj || subject,
          topic: tName || topicName,
          subtopic_index: stI !== undefined ? stI : currentSubtopicIndex,
          objective_index: objI !== undefined ? objI : currentObjectiveIndex,
          status,
          answered_correctly: answeredCorrectly,
          time_spent_seconds: timeSpent,
        },
      });
    } catch (e) { console.error('Failed to save progress:', e); }
  }

  async function selectObjectiveAnswer(key) {
    if (questionAnswered) return;
    const q = questions[currentQuestionIndex];
    setQuestionAnswered(true);
    setSelectedAnswer(key);

    const isAiQuestion = typeof q.question_id === 'string' && q.question_id.startsWith('ai_');
    if (isAiQuestion) {
      const correctAnswer = q.correct_answer || q.answer || '';
      const isCorrect = key.toUpperCase() === correctAnswer.toUpperCase();
      setAnswerResult({ is_correct: isCorrect, correct_answer: correctAnswer, explanation: q.explanation || '' });
      await saveObjectiveProgressToDB(subject, topicName, currentSubtopicIndex, currentObjectiveIndex, 'completed', isCorrect, timeStartedRef.current);
      return;
    }

    try {
      const result = await api.request('/guided-learn/answer-question', {
        method: 'POST',
        requireAuth: true,
        body: {
          subject, topic: topicName,
          subtopic: currentObjective.subtopic_name,
          objective: currentObjective.objective_text,
          question_id: q.question_id,
          user_answer: key,
        },
      });
      setAnswerResult(result);
      await saveObjectiveProgressToDB(subject, topicName, currentSubtopicIndex, currentObjectiveIndex, 'completed', result.is_correct, timeStartedRef.current);
    } catch (e) {
      setAnswerResult({ error: true });
      setQuestionAnswered(false);
      setSelectedAnswer(null);
    }
  }

  async function goToNextObjective() {
    if (!currentObjective) return;
    const nav = currentObjective.navigation;
    if (!nav.has_next) {
      await loadTopicComplete(subject, topicName);
      return;
    }
    if (nav.subtopic_complete) {
      setSubtopicCompleteData({ nextSubtopicIndex: nav.next_subtopic_index, nextObjectiveIndex: nav.next_objective_index });
      setMode('subtopic-complete');
      return;
    }
    setCurrentSubtopicIndex(nav.next_subtopic_index);
    setCurrentObjectiveIndex(nav.next_objective_index);
    await loadObjectiveLearning(subject, topicName, nav.next_subtopic_index, nav.next_objective_index, topicStructure);
  }

  async function goToPrevObjective() {
    const stI = currentSubtopicIndex;
    const objI = currentObjectiveIndex;
    let nextSt = stI, nextObj = objI;
    if (objI > 0) {
      nextObj = objI - 1;
    } else if (stI > 0) {
      nextSt = stI - 1;
      const prevSt = topicStructure.subtopics[stI - 1];
      nextObj = prevSt.objectives.length - 1;
    }
    setCurrentSubtopicIndex(nextSt);
    setCurrentObjectiveIndex(nextObj);
    await loadObjectiveLearning(subject, topicName, nextSt, nextObj, topicStructure);
  }

  async function loadTopicComplete(subj, tName) {
    let weaknesses = [];
    try {
      const weakData = await api.request(`/guided-learn/weaknesses/${encodeURIComponent(subj || subject)}`, { requireAuth: true });
      weaknesses = (weakData.weaknesses || []).filter(w => w.topic === (tName || topicName));
    } catch (e) { /* no-op */ }
    setTopicCompleteWeaknesses(weaknesses);
    setMode('topic-complete');
  }

  async function showSubtopicQuiz(nextStIdx, nextObjIdx) {
    setLoading(true);
    setLoadingMsg('Generating quiz...');
    try {
      const quizData = await api.request(
        `/guided-learn/subtopic-quiz/${encodeURIComponent(subject)}/${encodeURIComponent(topicName)}/${currentSubtopicIndex}`,
        { requireAuth: true }
      );
      const quizQs = quizData.questions || [];
      if (quizQs.length === 0) {
        addToast('No quiz questions available. Continuing...', 'info');
        continueToNextSubtopic(nextStIdx, nextObjIdx);
        return;
      }
      setSubtopicQuiz({
        questions: quizQs,
        currentIndex: 0,
        answers: {},
        score: 0,
        total: quizQs.length,
        nextSubtopicIndex: nextStIdx,
        nextObjectiveIndex: nextObjIdx,
        phase: 'quiz', // 'quiz' | 'results'
      });
      setMode('subtopic-quiz');
    } catch (e) {
      addToast('Failed to load quiz: ' + e.message, 'error');
      continueToNextSubtopic(nextStIdx, nextObjIdx);
    } finally {
      setLoading(false);
    }
  }

  function selectQuizAnswer(key) {
    const quiz = subtopicQuiz;
    if (quiz.answers[quiz.currentIndex] !== undefined) return;
    const q = quiz.questions[quiz.currentIndex];
    const correctAnswer = q.correct_answer || q.answer;
    const isCorrect = key.toUpperCase() === correctAnswer.toUpperCase();
    const newAnswers = { ...quiz.answers, [quiz.currentIndex]: key };
    setSubtopicQuiz(prev => ({
      ...prev,
      answers: newAnswers,
      score: isCorrect ? prev.score + 1 : prev.score,
    }));
  }

  function nextQuizQuestion() {
    const quiz = subtopicQuiz;
    if (quiz.currentIndex >= quiz.total - 1) {
      setSubtopicQuiz(prev => ({ ...prev, phase: 'results' }));
      return;
    }
    setSubtopicQuiz(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
  }

  function continueToNextSubtopic(stIdx, objIdx) {
    setCurrentSubtopicIndex(stIdx);
    setCurrentObjectiveIndex(objIdx);
    loadObjectiveLearning(subject, topicName, stIdx, objIdx, topicStructure);
  }

  function loadTopicOverview() {
    setTopicOverviewData(topicStructure);
    setMode('topic-overview');
  }

  // ============================================================
  // TOPIC PRACTICE QUIZ
  // ============================================================

  async function startTopicPracticeQuiz(count) {
    setLoading(true);
    setLoadingMsg(`Loading ${count} JAMB questions...`);
    const subj = subject;
    const tName = topicName;
    try {
      const data = await api.request(
        `/guided-learn/questions/by-topic?subject=${encodeURIComponent(subj)}&topic=${encodeURIComponent(tName)}&limit=${count}`,
        { requireAuth: true }
      );
      if (!data.questions || data.questions.length === 0) {
        addToast('No JAMB questions found for this topic. Try a different quiz size.', 'warning');
        return;
      }
      setTopicQuizState({
        questions: data.questions, currentIndex: 0, answers: {},
        startTime: Date.now(), subject: subj, topic: tName, phase: 'quiz',
      });
      setTopicQuizResultData(null);
      setMode('topic-quiz');
    } catch (e) {
      addToast('Failed to load questions: ' + e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  function selectTopicQuizOption(key) {
    const quiz = topicQuizState;
    const question = quiz.questions[quiz.currentIndex];
    if (quiz.answers[question.id]) return;
    setTopicQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [question.id]: key },
    }));
  }

  function prevTopicQuizQuestion() {
    if (topicQuizState.currentIndex > 0) {
      setTopicQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
    }
  }

  function nextTopicQuizQuestion() {
    if (topicQuizState.currentIndex < topicQuizState.questions.length - 1) {
      setTopicQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    }
  }

  function jumpToTopicQuizQuestion(idx) {
    setTopicQuizState(prev => ({ ...prev, currentIndex: idx }));
  }

  function exitTopicQuiz() {
    if (window.confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
      setMode('static-topic-complete');
    }
  }

  function finishTopicQuiz() {
    const { questions, answers, startTime, subject: subj, topic: tName } = topicQuizState;
    let correct = 0, incorrect = 0, unanswered = 0;
    questions.forEach(q => {
      if (answers[q.id]) {
        if (answers[q.id] === q.correct_option_key) correct++; else incorrect++;
      } else unanswered++;
    });
    const totalQs = questions.length;
    const scorePercent = Math.round((correct / totalQs) * 100);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    setTopicQuizResultData({ correct, incorrect, unanswered, totalQs, scorePercent, timeTaken, subject: subj, topic: tName, phase: 'results' });
    setMode('topic-quiz-result');
  }

  function reviewTopicQuizAnswers() {
    setMode('topic-quiz-review');
  }

  // ============================================================
  // COMPUTED VALUES for current static objective
  // ============================================================

  function calcStaticProgress() {
    if (!staticContent) return { totalObjectives: 0, currentPosition: 0, progressPercent: 0 };
    let totalObjectives = 0, currentPosition = 0;
    staticContent.subtopics.forEach((st, stIdx) => {
      st.objectives.forEach((obj, objIdx) => {
        totalObjectives++;
        if (stIdx < currentSubtopicIndex || (stIdx === currentSubtopicIndex && objIdx < currentObjectiveIndex)) currentPosition++;
      });
    });
    currentPosition++;
    return { totalObjectives, currentPosition, progressPercent: (currentPosition / totalObjectives) * 100 };
  }

  // ============================================================
  // RENDER HELPERS
  // ============================================================

  function renderStaticOptionItem(key, text, correctAnswer, questionAnsweredVal, selectedAnswerVal) {
    let cls = 'option-item';
    let icon = null;
    if (questionAnsweredVal) {
      if (key === correctAnswer) { cls += ' correct'; icon = <i className="fas fa-check"></i>; }
      else if (key === selectedAnswerVal) { cls += ' incorrect'; icon = <i className="fas fa-times"></i>; }
    }
    return (
      <div
        key={key}
        className={cls}
        onClick={() => selectStaticOption(key)}
        style={questionAnsweredVal ? { pointerEvents: 'none' } : {}}
      >
        <span className="option-key">{key}</span>
        <span className="option-text">{text}</span>
        {icon}
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  if (loading) {
    return (
      <Layout>
        <div className="loading-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#3B82F6' }}></i>
          <p style={{ color: '#64748b' }}>{loadingMsg}</p>
        </div>
      </Layout>
    );
  }

  // ── SUBJECT SELECT ───────────────────────────────────────────
  if (mode === 'subject-select') {
    return (
      <Layout>
        <div className="guided-learn-screen">
          <div className="learn-hero">
            <div className="hero-content">
              <div className="hero-badge"><i className="fas fa-bolt"></i> SMART LEARNING</div>
              <h1>Master Your Subjects</h1>
              <p>Learn topic-by-topic with structured objectives, clear explanations, and practice questions designed for JAMB success.</p>
            </div>
            <div className="hero-illustration"><i className="fas fa-graduation-cap"></i></div>
          </div>

          <div className="section-header">
            <h2><i className="fas fa-books"></i> Choose a Subject</h2>
            <p>Select a subject to explore its topics and start learning</p>
          </div>

          <div className="subject-grid">
            {subjects.map(s => {
              const colors = SUBJECT_COLORS[s.name] || { bg: 'linear-gradient(135deg, #64748B, #475569)', icon: '📘' };
              const hasContent = SUBJECTS_WITH_CONTENT.has(s.name);
              return (
                <div
                  key={s.name}
                  className={`subject-card-modern${hasContent ? '' : ' subject-card-disabled'}`}
                  onClick={() => hasContent ? selectGuidedSubject(s.name) : addToast(`${s.name} content is coming soon! Check back later.`, 'info')}
                >
                  {!hasContent && <div className="coming-soon-badge"><i className="fas fa-tools"></i> Coming Soon</div>}
                  <div className="subject-card-bg" style={{ background: colors.bg + (hasContent ? '' : '; filter: grayscale(0.7) opacity(0.6)') }}>
                    <div className="subject-card-icon">{colors.icon}</div>
                  </div>
                  <div className="subject-card-body">
                    <h3>{s.name}</h3>
                    <div className="subject-stats">
                      {hasContent
                        ? <span><i className="fas fa-book-open"></i> {s.topic_count} Topics</span>
                        : <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}><i className="fas fa-clock"></i> Under Construction</span>
                      }
                    </div>
                    <div className="subject-card-arrow"><i className={`fas fa-${hasContent ? 'arrow-right' : 'lock'}`}></i></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="learning-tips">
            <div className="tip-card">
              <div className="tip-icon"><i className="fas fa-lightbulb"></i></div>
              <div className="tip-content"><h4>Study Tip</h4><p>Focus on one topic at a time and complete all objectives before moving on.</p></div>
            </div>
            <div className="tip-card">
              <div className="tip-icon"><i className="fas fa-star"></i></div>
              <div className="tip-content"><h4>Earn Points</h4><p>Complete objectives and answer questions correctly to earn points!</p></div>
            </div>
            <div className="tip-card">
              <div className="tip-icon"><i className="fas fa-sync-alt"></i></div>
              <div className="tip-content"><h4>Review Weaknesses</h4><p>Topics you struggle with will be highlighted for extra practice.</p></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── TOPIC LIST ───────────────────────────────────────────────
  if (mode === 'topic-list') {
    const totalObjectives = topicList.reduce((sum, t) => sum + t.objective_count, 0);
    const completedObjectives = topicList.reduce((sum, t) => sum + t.completed_objectives, 0);
    const overallProgress = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;
    const completedTopics = topicList.filter(t => t.progress_percent === 100).length;
    return (
      <Layout>
        <div className="guided-learn-screen">
          <div className="subject-header-banner">
            <button className="back-btn" onClick={() => loadSubjects()}><i className="fas fa-arrow-left"></i></button>
            <div className="subject-header-content">
              <h1>{subject}</h1>
              <p>{topicList.length} Topics &bull; {totalObjectives} Learning Objectives</p>
            </div>
          </div>

          <div className="progress-overview-card">
            <div className="progress-circle-container">
              <div className="progress-circle" style={{ '--progress': overallProgress }}>
                <span className="progress-value">{overallProgress}%</span>
              </div>
            </div>
            <div className="progress-details">
              <h3>Your Progress</h3>
              <div className="progress-stats-row">
                <div className="progress-stat"><span className="stat-number">{completedTopics}</span><span className="stat-label">Topics Done</span></div>
                <div className="progress-stat"><span className="stat-number">{completedObjectives}</span><span className="stat-label">Objectives</span></div>
                <div className="progress-stat"><span className="stat-number">{topicList.length - completedTopics}</span><span className="stat-label">Remaining</span></div>
              </div>
            </div>
          </div>

          <div className="topics-section">
            <h2 className="section-title"><i className="fas fa-list-check"></i> Topics</h2>
            <div className="topic-cards-grid">
              {topicList.map(t => {
                const statusClass = t.progress_percent === 100 ? 'completed' : t.progress_percent > 0 ? 'in-progress' : 'not-started';
                const hasStatic = hasStaticContent(subject, t.name);
                return (
                  <div key={t.name} className={`topic-card-modern ${statusClass}`} onClick={() => selectGuidedTopic(t.name)}>
                    <div className="topic-card-header">
                      <div className="topic-number-badge">{t.number}</div>
                      {t.progress_percent === 100 && <div className="completed-check"><i className="fas fa-check-circle"></i></div>}
                      {hasStatic && <div className="static-indicator" title="Optimized content"><i className="fas fa-bolt"></i></div>}
                    </div>
                    <div className="topic-card-body">
                      <h3 className="topic-card-title">{t.name}</h3>
                      <div className="topic-card-meta">
                        <span><i className="fas fa-layer-group"></i> {t.subtopic_count} subtopics</span>
                        <span><i className="fas fa-bullseye"></i> {t.objective_count} objectives</span>
                      </div>
                      {t.weakness_count > 0 && (
                        <div className="weakness-indicator"><i className="fas fa-exclamation-triangle"></i> {t.weakness_count} areas need review</div>
                      )}
                    </div>
                    <div className="topic-card-footer">
                      <div className="topic-progress-bar">
                        <div className="topic-progress-fill" style={{ width: `${t.progress_percent}%` }}></div>
                      </div>
                      <div className="topic-progress-text">
                        <span>{t.completed_objectives}/{t.objective_count} completed</span>
                        <span className="progress-percent">{t.progress_percent}%</span>
                      </div>
                    </div>
                    <div className="topic-card-action">
                      <span>{t.progress_percent === 0 ? 'Start Learning' : t.progress_percent === 100 ? 'Review' : 'Continue'}</span>
                      <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── STATIC INTRO ─────────────────────────────────────────────
  if (mode === 'static-intro' && staticContent) {
    const intro = staticContent.introduction || {};
    let totalObjectives = 0;
    staticContent.subtopics.forEach(st => totalObjectives += st.objectives.length);
    return (
      <Layout>
        <div className="static-learn-screen">
          <div className="topic-intro-card">
            <div className="intro-icon"><i className="fas fa-rocket"></i></div>
            <h1 className="intro-title">{intro.title || topicName}</h1>
            <p className="intro-description">{intro.description || ''}</p>
            {intro.jambInfo && (
              <div className="jamb-info-box"><i className="fas fa-info-circle"></i><span>{intro.jambInfo}</span></div>
            )}
            <button className="btn btn-primary btn-lg start-btn" onClick={startStaticLearningFlow}>
              <i className="fas fa-play"></i> Start
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── STATIC LEARNING ──────────────────────────────────────────
  if (mode === 'static-learning' && staticContent) {
    const { totalObjectives, currentPosition, progressPercent } = calcStaticProgress();
    const subtopic = staticContent.subtopics[currentSubtopicIndex];
    const objective = subtopic.objectives[currentObjectiveIndex];
    const hasQuestion = !!(objective.question);
    const questionKey = `${currentSubtopicIndex}_${currentObjectiveIndex}`;
    const alreadyAnsweredKey = answeredQuestions[questionKey];

    if (staticStep === 'learn') {
      return (
        <Layout>
          <div className="static-learn-screen">
            <div className="objective-header">
              <div className="breadcrumb">
                <span className="clickable" onClick={() => loadTopicList(subject)}>{staticContent.subject}</span>
                <i className="fas fa-chevron-right"></i>
                <span className="clickable" onClick={() => loadTopicList(subject)}>{staticContent.topic}</span>
                <i className="fas fa-chevron-right"></i>
                <span className="current">{subtopic.name}</span>
              </div>
              <div className="progress-indicator">
                <span>{currentPosition} of {totalObjectives}</span>
                <div className="progress-bar-mini">
                  <div className="progress-fill-mini" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            </div>

            <div className="learn-step-indicator">
              <div className="step-item active">
                <div className="step-circle active"><i className="fas fa-book-open"></i></div>
                <span>Learn</span>
              </div>
              <div className={`step-connector ${hasQuestion ? '' : 'inactive'}`}></div>
              <div className={`step-item ${hasQuestion ? '' : 'inactive'}`}>
                <div className="step-circle"><i className="fas fa-pencil-alt"></i></div>
                <span>Practice</span>
              </div>
            </div>

            <div className="objective-banner">
              <div className="objective-label"><i className="fas fa-bullseye"></i> Objective {currentPosition}</div>
              <h2>{objective.title}</h2>
            </div>

            <div className="explanation-full">
              <div className="content-card">
                <div className="card-header"><h3><i className="fas fa-lightbulb"></i> Explanation</h3></div>
                <div className="card-body explanation-text" dangerouslySetInnerHTML={{ __html: objective.explanation }}></div>
              </div>

              {objective.workedExample && (
                <div className="content-card worked-example">
                  <div className="card-header"><h3><i className="fas fa-calculator"></i> Worked Example</h3></div>
                  <div className="card-body">
                    <div className="problem-box"><strong>Problem:</strong> {objective.workedExample.problem}</div>
                    <div className="solution-box"><strong>Solution:</strong><p>{objective.workedExample.solution}</p></div>
                    {objective.workedExample.explanation && (
                      <div className="explanation-box"><strong>Why:</strong><p>{objective.workedExample.explanation}</p></div>
                    )}
                  </div>
                </div>
              )}

              {objective.visuals && objective.visuals.length > 0 && (
                <div className="visual-card" dangerouslySetInnerHTML={{ __html: renderStaticVisualsHTML(objective.visuals) }}></div>
              )}
            </div>

            <div className="learning-navigation step-navigation">
              <button
                className="btn btn-outline"
                onClick={goToPrevStaticObjective}
                disabled={currentSubtopicIndex === 0 && currentObjectiveIndex === 0}
              >
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              {hasQuestion ? (
                <button className="btn btn-primary btn-practice-cta" onClick={goToStaticPractice}>
                  <i className="fas fa-pencil-alt"></i> Practice
                </button>
              ) : (
                <button className="btn btn-primary" onClick={() => goToNextStaticObjective()}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              )}
            </div>
          </div>
        </Layout>
      );
    }

    // staticStep === 'practice'
    const question = activeStaticQuestion;
    return (
      <Layout>
        <div className="static-learn-screen">
          <div className="objective-header">
            <div className="breadcrumb">
              <span className="clickable" onClick={() => loadTopicList(subject)}>{staticContent.subject}</span>
              <i className="fas fa-chevron-right"></i>
              <span className="clickable" onClick={() => loadTopicList(subject)}>{staticContent.topic}</span>
              <i className="fas fa-chevron-right"></i>
              <span className="current">{subtopic.name}</span>
            </div>
            <div className="progress-indicator">
              <span>{currentPosition} of {totalObjectives}</span>
              <div className="progress-bar-mini">
                <div className="progress-fill-mini" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="learn-step-indicator">
            <div className="step-item completed" onClick={() => setStaticStep('learn')} title="Back to Explanation">
              <div className="step-circle completed"><i className="fas fa-check"></i></div>
              <span>Learn</span>
            </div>
            <div className={`step-connector ${question ? 'active' : 'inactive'}`}></div>
            <div className={`step-item ${question ? 'active' : 'inactive'}`}>
              <div className={`step-circle ${question ? 'active' : ''}`}><i className="fas fa-pencil-alt"></i></div>
              <span>Practice</span>
            </div>
          </div>

          {question ? (
            <div className="objective-banner practice-banner">
              <div className="objective-label"><i className="fas fa-brain"></i> Test Your Understanding</div>
              <h2>{objective.title}</h2>
            </div>
          ) : (
            <div className="objective-banner">
              <div className="objective-label"><i className="fas fa-bullseye"></i> Objective {currentPosition}</div>
              <h2>{objective.title}</h2>
            </div>
          )}

          {question && (
            <div className="practice-full">
              <div className="content-card question-card-full">
                <div className="card-header">
                  <h3><i className="fas fa-question-circle"></i> Practice Question</h3>
                  {question.isJamb && question.year
                    ? <span className="badge">JAMB {question.year}</span>
                    : <span className="badge">JAMB Style</span>
                  }
                </div>
                <div className="card-body">
                  <div className="static-question">
                    <p className="question-text">{question.text}</p>
                    <div className="options-list">
                      {Object.entries(question.options).sort(([a], [b]) => a.localeCompare(b)).map(([key, text]) =>
                        renderStaticOptionItem(key, text, question.correctAnswer, staticQuestionAnswered, staticSelectedAnswer)
                      )}
                    </div>
                    {staticQuestionAnswered && (
                      <div className={`feedback-box ${staticSelectedAnswer === question.correctAnswer ? 'correct' : 'incorrect'}`}>
                        <div className="feedback-header">
                          <strong>Correct answer: {question.correctAnswer}</strong>
                          <span className="points-badge">+{staticSelectedAnswer === question.correctAnswer ? 15 : 10} pts</span>
                        </div>
                        <p><strong>Explanation:</strong> {question.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="learning-navigation step-navigation">
            <button className="btn btn-outline" onClick={() => setStaticStep('learn')}>
              <i className="fas fa-arrow-left"></i> Back to Explanation
            </button>
            <button
              className="btn btn-primary"
              onClick={() => goToNextStaticObjective()}
              disabled={question && !staticQuestionAnswered}
            >
              Next <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── STATIC SUBTOPIC COMPLETE ─────────────────────────────────
  if (mode === 'static-subtopic-complete' && staticContent) {
    const completedSubtopic = staticContent.subtopics[currentSubtopicIndex];
    const nextSubtopic = staticContent.subtopics[currentSubtopicIndex + 1];
    return (
      <Layout>
        <div className="static-learn-screen">
          <div className="subtopic-complete-card">
            <div className="complete-icon"><i className="fas fa-check-circle"></i></div>
            <h2>Subtopic Complete!</h2>
            <p className="completed-name">{completedSubtopic.name}</p>
            <div className="points-earned-banner"><i className="fas fa-star"></i><span>+25 Bonus Points!</span></div>

            {showJambQuiz && subtopicJambQuestions.length > 0 && (
              <div className="subtopic-jamb-quiz">
                <div className="jamb-quiz-header">
                  <i className="fas fa-graduation-cap"></i>
                  <h3>Past JAMB Questions</h3>
                  <p>Test yourself with {subtopicJambQuestions.length} real JAMB question{subtopicJambQuestions.length > 1 ? 's' : ''} on <strong>{completedSubtopic.name}</strong></p>
                </div>
                <div className="jamb-q-card">
                  {(() => {
                    const q = subtopicJambQuestions[subtopicJambIndex];
                    const answered = subtopicJambAnswers[subtopicJambIndex];
                    const optionKeys = Object.keys(q.options || {}).sort();
                    return (
                      <>
                        {q.year && <div className="jamb-year-badge">JAMB {q.year}</div>}
                        <div className="jamb-q-number">Question {subtopicJambIndex + 1} of {subtopicJambQuestions.length}</div>
                        <div className="jamb-q-text">{q.question_text}</div>
                        <div className="jamb-options">
                          {optionKeys.map(key => {
                            let cls = 'jamb-opt-btn';
                            if (answered) {
                              if (key === q.correct_option_key) cls += ' correct';
                              else if (key === answered.selected) cls += ' wrong';
                            }
                            return (
                              <button
                                key={key}
                                className={cls}
                                onClick={() => !answered && selectSubtopicJambAnswer(key, subtopicJambIndex)}
                                disabled={!!answered}
                              >
                                <span className="opt-key">{key}.</span> {q.options[key]}
                              </button>
                            );
                          })}
                        </div>
                        {answered && (
                          <div className="jamb-feedback" style={{ display: 'block' }}>
                            <div className={`feedback-${answered.isCorrect ? 'correct' : 'wrong'}`}>
                              <i className={`fas fa-${answered.isCorrect ? 'check-circle' : 'times-circle'}`}></i>
                              {answered.isCorrect ? 'Correct!' : <>Wrong. Correct answer: <strong>{q.correct_option_key}</strong></>}
                              {q.explanation && <p className="feedback-exp">{q.explanation}</p>}
                            </div>
                            <div className="jamb-q-nav">
                              {subtopicJambIndex + 1 < subtopicJambQuestions.length ? (
                                <button className="btn btn-primary" onClick={() => setSubtopicJambIndex(i => i + 1)}>
                                  Next Question <i className="fas fa-arrow-right"></i>
                                </button>
                              ) : (
                                <button className="btn btn-primary" onClick={() => { setShowJambQuiz(false); setShowNextSubtopicPreview(true); }}>
                                  Continue to Next Subtopic <i className="fas fa-arrow-right"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {showNextSubtopicPreview && (
              <div className="next-preview">
                <h3>Up Next:</h3>
                <p className="next-name">{nextSubtopic ? nextSubtopic.name : 'Topic Complete'}</p>
              </div>
            )}

            {showNextSubtopicPreview && (
              <button className="btn btn-primary btn-lg" onClick={continueToNextStaticSubtopic}>
                <i className="fas fa-arrow-right"></i> Continue
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // ── STATIC TOPIC COMPLETE ────────────────────────────────────
  if (mode === 'static-topic-complete' && staticContent) {
    const totalQs = Object.keys(answeredQuestions).length;
    const weakCount = weaknesses.length;
    const correctCount = totalQs - weakCount;
    let totalObjCount = 0;
    staticContent.subtopics.forEach(st => totalObjCount += st.objectives.length);
    const trophyClass = topicScorePercent >= 80 ? 'gold' : topicScorePercent >= 60 ? 'silver' : 'bronze';

    return (
      <Layout>
        <div className="static-learn-screen">
          <div className="topic-summary-card">
            <div className="summary-header">
              <div className={`trophy-icon ${trophyClass}`}><i className="fas fa-trophy"></i></div>
              <h1>Topic Complete!</h1>
              <h2>{staticContent.topic}</h2>
            </div>

            <div className="points-earned-section">
              <div className="big-points-badge"><i className="fas fa-star"></i><span>+{topicCompleteBonus} Points!</span></div>
              <p className="total-points-display">Total: <strong>{totalPoints}</strong> Points</p>
            </div>

            <div className="summary-stats">
              <div className="stat-card"><div className="stat-value">{totalObjCount}</div><div className="stat-label">Objectives Learned</div></div>
              <div className="stat-card"><div className="stat-value">{correctCount}/{totalQs}</div><div className="stat-label">Questions Correct</div></div>
              <div className="stat-card"><div className="stat-value">{topicScorePercent}%</div><div className="stat-label">Score</div></div>
            </div>

            {weakCount > 0 ? (
              <div className="weakness-section">
                <h3><i className="fas fa-exclamation-triangle"></i> Areas to Review</h3>
                <ul>
                  {weaknesses.map((w, idx) => (
                    <li key={idx} onClick={() => jumpToStaticWeakness(idx)}>
                      <span>{w.subtopicName}: {w.objectiveTitle}</span>
                      <i className="fas fa-chevron-right"></i>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="perfect-section">
                <i className="fas fa-star"></i>
                <p>Perfect! You answered all questions correctly!</p>
              </div>
            )}

            {/* Practice Quiz Section */}
            <div className="practice-quiz-section">
              <div className="quiz-section-header">
                <div className="quiz-icon-wrapper"><i className="fas fa-brain"></i></div>
                <div className="quiz-section-info">
                  <h3>Ready to Test Your Knowledge?</h3>
                  <p>Challenge yourself with real JAMB past questions on <strong>{staticContent.topic}</strong></p>
                </div>
              </div>
              <div className="quiz-cards-container">
                <div className="quiz-card quick" onClick={() => startTopicPracticeQuiz(10)}>
                  <div className="quiz-card-icon"><i className="fas fa-bolt"></i></div>
                  <div className="quiz-card-content"><span className="quiz-card-count">10</span><span className="quiz-card-label">Questions</span></div>
                  <div className="quiz-card-tag">Quick Quiz</div>
                  <div className="quiz-card-time"><i className="fas fa-clock"></i> ~5 mins</div>
                </div>
                <div className="quiz-card standard" onClick={() => startTopicPracticeQuiz(20)}>
                  <div className="quiz-card-badge">RECOMMENDED</div>
                  <div className="quiz-card-icon"><i className="fas fa-fire"></i></div>
                  <div className="quiz-card-content"><span className="quiz-card-count">20</span><span className="quiz-card-label">Questions</span></div>
                  <div className="quiz-card-tag">Standard</div>
                  <div className="quiz-card-time"><i className="fas fa-clock"></i> ~10 mins</div>
                </div>
                <div className="quiz-card full" onClick={() => startTopicPracticeQuiz(30)}>
                  <div className="quiz-card-icon"><i className="fas fa-trophy"></i></div>
                  <div className="quiz-card-content"><span className="quiz-card-count">30</span><span className="quiz-card-label">Questions</span></div>
                  <div className="quiz-card-tag">Full Practice</div>
                  <div className="quiz-card-time"><i className="fas fa-clock"></i> ~15 mins</div>
                </div>
              </div>
              <div className="custom-quiz-section">
                <div className="custom-quiz-divider"><span>or customize your quiz</span></div>
                <div className="custom-quiz-controls">
                  <div className="custom-input-group">
                    <label htmlFor="quizCount">Number of questions:</label>
                    <input
                      type="number" id="quizCount" min="5" max="50"
                      value={customQuizCount}
                      onChange={e => setCustomQuizCount(parseInt(e.target.value) || 10)}
                    />
                  </div>
                  <button className="btn btn-primary btn-custom-start" onClick={() => startTopicPracticeQuiz(customQuizCount)}>
                    <i className="fas fa-play-circle"></i> Start Custom Quiz
                  </button>
                </div>
              </div>
            </div>

            <div className="key-points-section">
              <h3><i className="fas fa-key"></i> Key Points</h3>
              <ul>
                {staticContent.subtopics.slice(0, 5).map((st, i) => (
                  <li key={i}><i className="fas fa-check"></i> {st.name}</li>
                ))}
              </ul>
            </div>

            <div className="summary-actions">
              {weakCount > 0 && (
                <button className="btn btn-outline" onClick={() => jumpToStaticWeakness(0)}>
                  <i className="fas fa-redo"></i> Review Weak Areas
                </button>
              )}
              <button className="btn btn-primary" onClick={restartStaticTopic}>
                <i className="fas fa-sync"></i> Restart Topic
              </button>
              <button className="btn btn-secondary" onClick={() => loadTopicList(subject)}>
                <i className="fas fa-list"></i> Back to Topics
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── TOPIC QUIZ (from static-topic-complete practice section) ─
  if (mode === 'topic-quiz' && topicQuizState) {
    const { questions: qList, currentIndex, answers } = topicQuizState;
    const question = qList[currentIndex];
    const totalQs = qList.length;
    const progress = Math.round((currentIndex / totalQs) * 100);
    const previousAnswer = answers[question.id];

    return (
      <Layout>
        <div className="topic-quiz-screen">
          <div className="quiz-header">
            <div className="quiz-nav">
              <button className="btn btn-outline btn-sm" onClick={exitTopicQuiz}><i className="fas fa-times"></i> Exit Quiz</button>
              <div className="quiz-title">
                <h2>{topicQuizState.topic}</h2>
                <span className="quiz-subtitle">{topicQuizState.subject} Practice</span>
              </div>
              <div className="quiz-progress-info"><span>{currentIndex + 1} / {totalQs}</span></div>
            </div>
            <div className="quiz-progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }}></div></div>
          </div>

          <div className="quiz-content">
            <div className="quiz-question-card">
              {question.year && <div className="question-year">JAMB {question.year}</div>}
              <div className="question-number">Question {currentIndex + 1}</div>
              <div className="question-text">{question.question_text}</div>
              {question.image_path && (
                <div className="question-image">
                  <img src={question.image_path} alt="Question diagram" onError={e => e.target.style.display = 'none'} />
                </div>
              )}
              <div className="quiz-options">
                {['A', 'B', 'C', 'D'].map(key => {
                  const optionText = question.options?.[key] || question[`option_${key.toLowerCase()}`] || '';
                  if (!optionText) return null;
                  let cls = 'quiz-option';
                  if (previousAnswer) {
                    if (key === question.correct_option_key) cls += ' correct';
                    else if (key === previousAnswer) cls += ' incorrect';
                  }
                  return (
                    <div
                      key={key}
                      className={cls}
                      onClick={() => selectTopicQuizOption(key)}
                      data-key={key}
                      style={previousAnswer ? { pointerEvents: 'none' } : {}}
                    >
                      <span className="option-key">{key}</span>
                      <span className="option-text">{optionText}</span>
                    </div>
                  );
                })}
              </div>
              <div className={`quiz-feedback ${previousAnswer ? '' : 'hidden'}`}>
                {previousAnswer && (
                  previousAnswer === question.correct_option_key
                    ? <div className="feedback-correct"><i className="fas fa-check-circle"></i> Correct!</div>
                    : <div className="feedback-incorrect"><i className="fas fa-times-circle"></i> Incorrect. The answer is {question.correct_option_key}.</div>
                )}
                {question.explanation && previousAnswer && (
                  <div className="feedback-explanation"><strong>Explanation:</strong> {question.explanation}</div>
                )}
              </div>
            </div>
          </div>

          <div className="quiz-navigation">
            <button className="btn btn-outline" onClick={prevTopicQuizQuestion} disabled={currentIndex === 0}>
              <i className="fas fa-chevron-left"></i> Previous
            </button>
            <div className="quiz-dots">
              {qList.slice(Math.max(0, currentIndex - 3), currentIndex + 4).map((q, i) => {
                const actualIdx = Math.max(0, currentIndex - 3) + i;
                const isAnswered = answers[qList[actualIdx]?.id];
                const isCurrent = actualIdx === currentIndex;
                return (
                  <span
                    key={actualIdx}
                    className={`quiz-dot ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                    onClick={() => jumpToTopicQuizQuestion(actualIdx)}
                  ></span>
                );
              })}
            </div>
            {currentIndex === totalQs - 1 ? (
              <button className="btn btn-primary" onClick={finishTopicQuiz}>
                <i className="fas fa-flag-checkered"></i> Finish Quiz
              </button>
            ) : (
              <button className="btn btn-primary" onClick={nextTopicQuizQuestion}>
                Next <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  // ── TOPIC QUIZ RESULT ────────────────────────────────────────
  if (mode === 'topic-quiz-result' && topicQuizResultData) {
    const { correct, incorrect, unanswered, totalQs, scorePercent, timeTaken, subject: subj, topic: tName } = topicQuizResultData;
    const trophyClass = scorePercent >= 80 ? 'gold' : scorePercent >= 60 ? 'silver' : 'bronze';
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    return (
      <Layout>
        <div className="quiz-result-screen">
          <div className="result-card">
            <div className="result-header">
              <div className={`trophy-icon ${trophyClass}`}><i className="fas fa-trophy"></i></div>
              <h1>Quiz Complete!</h1>
              <h2>{tName}</h2>
              <p className="subject-label">{subj} Practice Quiz</p>
            </div>
            <div className="result-score">
              <div className={`score-circle ${trophyClass}`}><span className="score-value">{scorePercent}%</span></div>
            </div>
            <div className="result-stats">
              <div className="stat-item correct"><i className="fas fa-check-circle"></i><span className="stat-value">{correct}</span><span className="stat-label">Correct</span></div>
              <div className="stat-item incorrect"><i className="fas fa-times-circle"></i><span className="stat-value">{incorrect}</span><span className="stat-label">Incorrect</span></div>
              <div className="stat-item unanswered"><i className="fas fa-minus-circle"></i><span className="stat-value">{unanswered}</span><span className="stat-label">Skipped</span></div>
              <div className="stat-item time"><i className="fas fa-clock"></i><span className="stat-value">{minutes}:{String(seconds).padStart(2, '0')}</span><span className="stat-label">Time</span></div>
            </div>
            <div className="result-message">
              {scorePercent >= 80
                ? <p><i className="fas fa-star"></i> Excellent! You've mastered this topic!</p>
                : scorePercent >= 60
                ? <p><i className="fas fa-thumbs-up"></i> Good job! Keep practicing to improve.</p>
                : <p><i className="fas fa-book-reader"></i> Review the topic and try again.</p>
              }
            </div>
            <div className="result-actions">
              <button className="btn btn-outline" onClick={reviewTopicQuizAnswers}><i className="fas fa-eye"></i> Review Answers</button>
              <button className="btn btn-primary" onClick={() => startTopicPracticeQuiz(totalQs)}><i className="fas fa-redo"></i> Try Again</button>
              <button className="btn btn-secondary" onClick={() => setMode('static-topic-complete')}><i className="fas fa-arrow-left"></i> Back to Summary</button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ── TOPIC QUIZ REVIEW ────────────────────────────────────────
  if (mode === 'topic-quiz-review' && topicQuizState) {
    const { questions: qList, answers } = topicQuizState;
    return (
      <Layout>
        <div className="quiz-review-screen">
          <div className="review-header">
            <button className="btn btn-outline" onClick={() => setMode('topic-quiz-result')}><i className="fas fa-arrow-left"></i> Back to Results</button>
            <h2>Answer Review: {topicQuizState.topic}</h2>
          </div>
          <div className="review-questions">
            {qList.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct_option_key;
              const isSkipped = !userAnswer;
              return (
                <div key={idx} className={`review-question-card ${isSkipped ? 'skipped' : isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="review-question-header">
                    <span className="question-num">Q{idx + 1}</span>
                    {q.year && <span className="question-year">JAMB {q.year}</span>}
                    <span className={`status-badge ${isSkipped ? 'skipped' : isCorrect ? 'correct' : 'incorrect'}`}>
                      {isSkipped ? 'Skipped' : isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="review-question-text">{q.question_text}</div>
                  {q.image_path && (
                    <div className="question-image" style={{ margin: '12px 0' }}>
                      <img src={`/api/v1/static/${q.image_path}`} alt="Question" style={{ maxWidth: '100%', borderRadius: '8px' }} onError={e => e.target.style.display = 'none'} />
                    </div>
                  )}
                  <div className="review-options">
                    {['A', 'B', 'C', 'D'].map(key => {
                      const optionText = q.options?.[key] || q[`option_${key.toLowerCase()}`] || '';
                      if (!optionText) return null;
                      let cls = 'review-option';
                      if (key === q.correct_option_key) cls += ' correct-answer';
                      if (key === userAnswer && key !== q.correct_option_key) cls += ' wrong-answer';
                      return (
                        <div key={key} className={cls}>
                          <span className="opt-key">{key}</span>
                          <span className="opt-text">{optionText}</span>
                          {key === q.correct_option_key && <i className="fas fa-check"></i>}
                          {key === userAnswer && key !== q.correct_option_key && <i className="fas fa-times"></i>}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && (
                    <div className="review-explanation"><strong>Explanation:</strong> {q.explanation}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Layout>
    );
  }

  // ── NON-STATIC OBJECTIVE LEARNING ───────────────────────────
  if (mode === 'learning' && currentObjective) {
    const nav = currentObjective.navigation;
    const q = questions[currentQuestionIndex] || null;

    const nextBtnLabel = nav.has_next
      ? (nav.subtopic_complete ? <span>Finish Subtopic <i className="fas fa-flag-checkered"></i></span> : <span>Next <i className="fas fa-arrow-right"></i></span>)
      : <span>Complete Topic <i className="fas fa-trophy"></i></span>;

    if (objectiveStep === 'learn') {
      return (
        <Layout>
          <div className="objective-learning-screen enhanced">
            <div className="objective-header">
              <div className="breadcrumb">
                <span onClick={() => loadTopicList(subject)} className="clickable">{subject}</span>
                <i className="fas fa-chevron-right"></i>
                <span onClick={loadTopicOverview} className="clickable">{topicName}</span>
                <i className="fas fa-chevron-right"></i>
                <span className="current">{currentObjective.subtopic_name}</span>
              </div>
              <div className="progress-indicator">
                <span className="progress-text">{nav.current_position} of {nav.total_objectives}</span>
                <div className="mini-progress">
                  <div className="mini-progress-fill" style={{ width: `${(nav.current_position / nav.total_objectives) * 100}%` }}></div>
                </div>
              </div>
            </div>

            <div className="objective-title-box">
              <div className="objective-title-left">
                <span className="objective-badge"><i className="fas fa-bullseye"></i> Objective {nav.current_position}</span>
                <h2>{currentObjective.objective_text}</h2>
              </div>
            </div>

            <div className="learn-step-indicator">
              <div className="step-item active">
                <div className="step-circle active"><i className="fas fa-book-open"></i></div>
                <span>Learn</span>
              </div>
              <div className={`step-connector ${questions.length > 0 ? '' : 'inactive'}`}></div>
              <div className={`step-item ${questions.length > 0 ? '' : 'inactive'}`}>
                <div className="step-circle"><i className="fas fa-pencil-alt"></i></div>
                <span>Practice</span>
              </div>
            </div>

            <div className="learning-content-flow">
              <div className="content-section explanation-section">
                <div className="section-header-bar" onClick={() => setExplanationCollapsed(c => !c)}>
                  <div className="section-title">
                    <i className="fas fa-lightbulb"></i>
                    <h3>Explanation</h3>
                  </div>
                  <div className="section-controls">
                    <i className={`fas fa-chevron-${explanationCollapsed ? 'down' : 'up'} section-toggle`}></i>
                  </div>
                </div>
                <div className={`section-content ${explanationCollapsed ? 'collapsed' : ''}`} dangerouslySetInnerHTML={{ __html: explanationHTML }}></div>
              </div>
            </div>

            <div className="objective-navigation step-navigation">
              <button className="btn btn-outline" disabled={!nav.has_prev} onClick={goToPrevObjective}>
                <i className="fas fa-arrow-left"></i> Previous
              </button>
              <button className="btn btn-outline" onClick={loadTopicOverview}>
                <i className="fas fa-list"></i> Overview
              </button>
              {questions.length > 0 ? (
                <button className="btn btn-primary btn-practice-cta" onClick={() => setObjectiveStep('practice')}>
                  <i className="fas fa-pencil-alt"></i> Practice
                </button>
              ) : (
                <button className="btn btn-primary" onClick={goToNextObjective}>
                  {nextBtnLabel}
                </button>
              )}
            </div>
          </div>
        </Layout>
      );
    }

    // objectiveStep === 'practice'
    return (
      <Layout>
        <div className="objective-learning-screen enhanced">
          <div className="objective-header">
            <div className="breadcrumb">
              <span onClick={() => loadTopicList(subject)} className="clickable">{subject}</span>
              <i className="fas fa-chevron-right"></i>
              <span onClick={loadTopicOverview} className="clickable">{topicName}</span>
              <i className="fas fa-chevron-right"></i>
              <span className="current">{currentObjective.subtopic_name}</span>
            </div>
            <div className="progress-indicator">
              <span className="progress-text">{nav.current_position} of {nav.total_objectives}</span>
              <div className="mini-progress">
                <div className="mini-progress-fill" style={{ width: `${(nav.current_position / nav.total_objectives) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="learn-step-indicator">
            <div className="step-item completed" onClick={() => setObjectiveStep('learn')} title="Back to Explanation">
              <div className="step-circle completed"><i className="fas fa-check"></i></div>
              <span>Learn</span>
            </div>
            <div className="step-connector active"></div>
            <div className="step-item active">
              <div className="step-circle active"><i className="fas fa-pencil-alt"></i></div>
              <span>Practice</span>
            </div>
          </div>

          <div className="objective-title-box practice-banner">
            <div className="objective-title-left">
              <span className="objective-badge practice-badge"><i className="fas fa-brain"></i> Test Your Understanding</span>
              <h2>{currentObjective.objective_text}</h2>
            </div>
          </div>

          <div className="practice-full">
            <div className="content-section question-section-full">
              <div className="section-header-bar">
                <div className="section-title">
                  <i className="fas fa-question-circle"></i>
                  <h3>Practice Question</h3>
                  {q && q.year ? <span className="question-badge">JAMB {q.year}</span> : <span className="question-badge">JAMB Style</span>}
                </div>
              </div>
              <div className="section-content">
                {q ? (
                  <div className="objective-question">
                    {q.passage && (
                      <div className="passage-box">
                        <h4><i className="fas fa-book-open"></i> Passage</h4>
                        <p>{q.passage}</p>
                      </div>
                    )}
                    {q.image_path && (
                      <div className="question-image">
                        <img src={`/api/v1/static/${q.image_path}`} alt="Question" onError={e => e.target.style.display = 'none'} />
                      </div>
                    )}
                    <p className="question-text">{q.question}</p>
                    <div className="options-list">
                      {Object.entries(q.options || {}).map(([key, text]) => {
                        let cls = 'option-item';
                        if (questionAnswered && answerResult) {
                          if (key === answerResult.correct_answer) cls += ' correct';
                          else if (key === selectedAnswer && key !== answerResult.correct_answer) cls += ' incorrect';
                        } else if (key === selectedAnswer) cls += ' selected';
                        return (
                          <div key={key} className={cls} onClick={() => selectObjectiveAnswer(key)}>
                            <span className="option-key">{key}</span>
                            <span className="option-text">{text}</span>
                          </div>
                        );
                      })}
                    </div>
                    {answerResult && !answerResult.error && (
                      <div className={`answer-feedback ${answerResult.is_correct ? 'correct' : 'incorrect'}`}>
                        {answerResult.is_correct
                          ? <><i className="fas fa-check-circle"></i><strong>Correct!</strong></>
                          : <><i className="fas fa-times-circle"></i><strong>Not quite right</strong></>
                        }
                        {answerResult.explanation && <p>{answerResult.explanation}</p>}
                      </div>
                    )}
                    {answerResult?.error && (
                      <div className="answer-feedback incorrect">
                        <i className="fas fa-exclamation-triangle"></i> Could not check answer. Please try again.
                      </div>
                    )}
                  </div>
                ) : (
                  <p style={{ color: '#64748b', padding: '20px' }}>No practice question available for this objective.</p>
                )}
              </div>
            </div>
          </div>

          <div className="objective-navigation step-navigation">
            <button className="btn btn-outline" onClick={() => setObjectiveStep('learn')}>
              <i className="fas fa-arrow-left"></i> Back to Explanation
            </button>
            <button className="btn btn-outline" onClick={loadTopicOverview}>
              <i className="fas fa-list"></i> Overview
            </button>
            <button className="btn btn-primary" onClick={goToNextObjective} disabled={!questionAnswered}>
              {nextBtnLabel}
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── SUBTOPIC COMPLETE (non-static) ───────────────────────────
  if (mode === 'subtopic-complete' && subtopicCompleteData && topicStructure) {
    const { nextSubtopicIndex, nextObjectiveIndex } = subtopicCompleteData;
    const currentSubtopic = topicStructure.subtopics[currentSubtopicIndex];
    const nextSubtopicData = topicStructure.subtopics[nextSubtopicIndex];
    return (
      <Layout>
        <div className="subtopic-complete-screen">
          <div className="complete-animation"><i className="fas fa-check-circle"></i></div>
          <h2>Subtopic Complete!</h2>
          <p>You've completed all objectives in:</p>
          <div className="completed-name">{currentSubtopic.name}</div>
          <div className="subtopic-quiz-prompt">
            <h3><i className="fas fa-brain"></i> Test Your Knowledge</h3>
            <p>Take a quick quiz on what you just learned before moving on.</p>
            <button className="btn btn-primary btn-lg" onClick={() => showSubtopicQuiz(nextSubtopicIndex, nextObjectiveIndex)}>
              <i className="fas fa-clipboard-check"></i> Take Quiz
            </button>
          </div>
          <div className="skip-quiz">
            <button className="btn btn-outline" onClick={() => continueToNextSubtopic(nextSubtopicIndex, nextObjectiveIndex)}>
              Skip &amp; Continue to {nextSubtopicData?.name} <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── SUBTOPIC QUIZ (non-static) ───────────────────────────────
  if (mode === 'subtopic-quiz' && subtopicQuiz) {
    const quiz = subtopicQuiz;

    if (quiz.phase === 'results') {
      const percentage = Math.round((quiz.score / quiz.total) * 100);
      const currentSubtopicData = topicStructure?.subtopics[currentSubtopicIndex];
      const nextSubtopicData = topicStructure?.subtopics[quiz.nextSubtopicIndex];
      let gradeClass = 'poor', gradeIcon = 'fa-sad-tear', gradeMessage = 'Keep practicing!';
      if (percentage >= 80) { gradeClass = 'excellent'; gradeIcon = 'fa-trophy'; gradeMessage = 'Excellent work!'; }
      else if (percentage >= 60) { gradeClass = 'good'; gradeIcon = 'fa-thumbs-up'; gradeMessage = 'Good job!'; }
      else if (percentage >= 40) { gradeClass = 'fair'; gradeIcon = 'fa-meh'; gradeMessage = 'Not bad, but room to improve.'; }
      return (
        <Layout>
          <div className="subtopic-quiz-screen">
            <div className="quiz-header">
              <div className="quiz-title">
                <i className="fas fa-clipboard-check"></i>
                <h2>{currentSubtopicData?.name} - Quiz</h2>
              </div>
            </div>
            <div className="quiz-body">
              <div className="quiz-results">
                <div className={`result-icon ${gradeClass}`}><i className={`fas ${gradeIcon}`}></i></div>
                <h2>{gradeMessage}</h2>
                <div className={`result-score ${gradeClass}`}>
                  <span className="score-number">{quiz.score}</span>
                  <span className="score-divider">/</span>
                  <span className="score-total">{quiz.total}</span>
                </div>
                <p className="score-percentage">{percentage}%</p>
                <p className="result-subtopic">{currentSubtopicData?.name} Quiz</p>
                <div className="quiz-question-review">
                  {quiz.questions.map((q, i) => {
                    const correctAnswer = q.correct_answer || q.answer;
                    const userAnswer = quiz.answers[i];
                    const isCorrect = userAnswer && userAnswer.toUpperCase() === correctAnswer.toUpperCase();
                    return (
                      <div key={i} className={`review-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <span className="review-num">{i + 1}</span>
                        <i className={`fas ${isCorrect ? 'fa-check' : 'fa-times'}`}></i>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="quiz-footer">
              <button className="btn btn-outline" onClick={() => showSubtopicQuiz(quiz.nextSubtopicIndex, quiz.nextObjectiveIndex)}>
                <i className="fas fa-redo"></i> Retake Quiz
              </button>
              <button className="btn btn-primary" onClick={() => continueToNextSubtopic(quiz.nextSubtopicIndex, quiz.nextObjectiveIndex)}>
                Continue to {nextSubtopicData?.name} <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </Layout>
      );
    }

    // phase === 'quiz'
    const q = quiz.questions[quiz.currentIndex];
    const alreadyAnswered = quiz.answers[quiz.currentIndex];
    let options = {};
    if (Array.isArray(q.options)) {
      ['A', 'B', 'C', 'D'].forEach((key, i) => { if (i < q.options.length) options[key] = q.options[i]; });
    } else {
      options = q.options || {};
    }
    const correctAnswer = q.correct_answer || q.answer;
    const isCorrect = alreadyAnswered && alreadyAnswered.toUpperCase() === (correctAnswer || '').toUpperCase();

    return (
      <Layout>
        <div className="subtopic-quiz-screen">
          <div className="quiz-header">
            <div className="quiz-title">
              <i className="fas fa-clipboard-check"></i>
              <h2>{topicStructure?.subtopics[currentSubtopicIndex]?.name} - Quiz</h2>
            </div>
            <div className="quiz-progress">
              <span>Question {quiz.currentIndex + 1} of {quiz.total}</span>
              <div className="mini-progress">
                <div className="mini-progress-fill" style={{ width: `${((quiz.currentIndex + 1) / quiz.total) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="quiz-body">
            <div className="quiz-question-card">
              {q.objective && <div className="quiz-objective-tag"><i className="fas fa-bullseye"></i> {q.objective}</div>}
              <p className="quiz-question-text">{q.question}</p>
              <div className="quiz-options">
                {Object.entries(options).map(([key, text]) => {
                  let cls = 'quiz-option';
                  if (alreadyAnswered) {
                    if (key === correctAnswer) cls += ' correct';
                    else if (key === alreadyAnswered && !isCorrect) cls += ' incorrect';
                    cls += ' disabled';
                  }
                  return (
                    <div key={key} className={cls} onClick={() => selectQuizAnswer(key)}>
                      <span className="option-key">{key}</span>
                      <span className="option-text">{text}</span>
                    </div>
                  );
                })}
              </div>
              {alreadyAnswered && (
                <div className={`quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="feedback-icon">
                    {isCorrect ? <i className="fas fa-check-circle"></i> : <i className="fas fa-times-circle"></i>}
                  </div>
                  <div className="feedback-text">
                    <strong>{isCorrect ? 'Correct!' : 'Incorrect'}</strong>
                    {q.explanation && <p>{q.explanation}</p>}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="quiz-footer">
            <button className="btn btn-outline" onClick={() => continueToNextSubtopic(quiz.nextSubtopicIndex, quiz.nextObjectiveIndex)}>
              <i className="fas fa-times"></i> Skip Quiz
            </button>
            <button
              className="btn btn-primary"
              disabled={!alreadyAnswered}
              onClick={nextQuizQuestion}
            >
              {quiz.currentIndex === quiz.total - 1
                ? <span>See Results <i className="fas fa-chart-bar"></i></span>
                : <span>Next <i className="fas fa-arrow-right"></i></span>
              }
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── TOPIC COMPLETE (non-static) ──────────────────────────────
  if (mode === 'topic-complete') {
    return (
      <Layout>
        <div className="topic-complete-screen">
          <div className="complete-animation big"><i className="fas fa-trophy"></i></div>
          <h1>Topic Mastered!</h1>
          <p>You've completed all objectives in:</p>
          <div className="completed-topic-name">{topicName}</div>

          {topicCompleteWeaknesses.length > 0 ? (
            <div className="weakness-summary">
              <h3><i className="fas fa-exclamation-triangle"></i> Areas to Review</h3>
              <p>{topicCompleteWeaknesses.length} objective(s) need more practice</p>
              <button className="btn btn-warning" onClick={() => {
                setCurrentSubtopicIndex(0);
                setCurrentObjectiveIndex(0);
                loadObjectiveLearning(subject, topicName, 0, 0, topicStructure);
              }}>
                <i className="fas fa-redo"></i> Review Weak Areas
              </button>
            </div>
          ) : (
            <div className="perfect-score">
              <i className="fas fa-star"></i>
              <p>Perfect! You answered all questions correctly!</p>
            </div>
          )}

          <div className="complete-actions">
            <button className="btn btn-outline" onClick={() => loadTopicList(subject)}>
              <i className="fas fa-list"></i> Choose Another Topic
            </button>
            <button className="btn btn-primary" onClick={loadTopicOverview}>
              <i className="fas fa-play"></i> Practice Questions
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  // ── TOPIC OVERVIEW (non-static) ──────────────────────────────
  if (mode === 'topic-overview' && topicOverviewData) {
    const topic = topicOverviewData;
    return (
      <Layout>
        <div className="topic-overview-screen">
          <div className="overview-header">
            <button className="btn btn-outline" onClick={() => setMode('learning')}>
              <i className="fas fa-arrow-left"></i> Back to Learning
            </button>
            <h2>{topic.name}</h2>
          </div>
          <div className="subtopics-overview">
            {topic.subtopics.map((st, stIdx) => (
              <div key={stIdx} className="subtopic-overview-card">
                <div className="subtopic-header">
                  <h3>{st.name}</h3>
                  <span className="completed-badge">{st.completed_count}/{st.objectives.length}</span>
                </div>
                <div className="objectives-list">
                  {st.objectives.map((obj, objIdx) => (
                    <div
                      key={objIdx}
                      className={`objective-item ${obj.status}`}
                      onClick={() => {
                        setCurrentSubtopicIndex(stIdx);
                        setCurrentObjectiveIndex(objIdx);
                        loadObjectiveLearning(subject, topicName, stIdx, objIdx, topicStructure);
                      }}
                    >
                      <span className="status-icon">
                        {obj.status === 'completed'
                          ? <i className="fas fa-check-circle"></i>
                          : obj.status === 'in_progress'
                          ? <i className="fas fa-play-circle"></i>
                          : <i className="fas fa-circle"></i>
                        }
                      </span>
                      <span className="objective-text">{obj.text}</span>
                      {obj.is_weakness && <span className="weakness-icon"><i className="fas fa-exclamation-triangle"></i></span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Fallback
  return (
    <Layout>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#3B82F6' }}></i>
        <p style={{ color: '#64748b', marginTop: '1rem' }}>Loading...</p>
      </div>
    </Layout>
  );
}
