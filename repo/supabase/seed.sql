-- ============================================================================
-- LaNutria · Datos de demostración (semilla)
-- ----------------------------------------------------------------------------
-- GENERADO AUTOMÁTICAMENTE por app/scripts/gen-seed-sql.mjs — no editar a mano.
-- Ejecuta primero schema.sql y luego este archivo en el SQL Editor de Supabase.
--
-- Es idempotente (UPSERT): puedes ejecutarlo varias veces sin duplicar datos.
-- Solo datos FICTICIOS. No metas datos reales de pacientes hasta tener login.
-- ============================================================================

-- ---- Pacientes -------------------------------------------------------------
insert into public.patients
  (id, first_name, last_name, birth_date, phone, email, status, professional, last_consult, next_review, deleted, data, created_at, updated_at)
values (
  'pat_marta', 'Marta', 'Iglesias', '1990-04-12', '600 111 222', 'marta.iglesias@email.com',
  'active', 'Elena Vidal', '2025-06-12', '2025-06-20', false,
  $json${"profession":"Diseñadora","photo":null,"admittedAt":"2025-02-01","observations":"Muy constante. Trabaja desde casa.","assessment":{"goals":["Pérdida de peso","Mejora de hábitos alimentarios"],"goalDescription":"Bajar grasa corporal de forma sostenible sin pasar hambre.","motivation":8,"targetDate":"","goalNotes":"","measurement":{"id":"meas_mqpgc8gh","date":"2026-06-22","weight":"","height":"","usualWeight":"","targetWeight":"","waist":"","hip":"","fatPct":"","musclePct":"","notes":"","createdAt":"2026-06-22T16:50:49.956Z","updatedAt":"2026-06-22T16:50:49.956Z","author":"Elena Vidal","deleted":false},"conditions":[],"diagnoses":"","surgeries":"","familyHistory":"","medication":"","supplements":"","labs":"","medicalNotes":"","allergies":"Frutos secos","intolerances":"Lactosa (leve)","avoidFoods":"","dislikedFoods":"","preferredFoods":"","dietType":"Omnívora","workSchedule":"","wakeTime":"","sleepTime":"","sleepHours":"","sleepQuality":7,"stress":5,"tobacco":"No","alcohol":"No","water":"","habitsNotes":"","activityLevel":"Moderadamente activo","exerciseType":"Fuerza 3 días/semana","trainingDays":"","trainingDuration":"","trainingTime":"","sportGoal":"","injuries":"","activityNotes":"","mealsPerDay":"","whoCooks":"","eatsOut":"","cookingTime":"","budget":"","pastDiets":"","pastResults":"","rebound":"No","foodRelationship":"","eatingAnxiety":"","boredomEating":"","bingeing":"No","foodFears":"","dietaryNotes":"","foodRecord":{"breakfast":"","midMorning":"","lunch":"","snack":"","dinner":"","between":"","drinks":"","weekendDiff":""},"digestive":[],"stoolFrequency":"","bristol":"","digestiveNotes":"","completedSteps":[0,1,2,3,4,5,6,7,8,9],"updatedAt":"2025-02-10T10:00:00.000Z"},"plan":{"id":"plan_mqpgc8gi","name":"Plan de mantenimiento equilibrado","start":"2025-06-01","end":"","review":"2025-07-01","objective":"Reducir grasa corporal manteniendo masa muscular.","energy":"1850","meals":5,"protein":"120","carbs":"190","fat":"60","fiber":"30","water":"2.0","notes":"Repartir proteína en todas las comidas. Cálculos orientativos, revisar en consulta.","recommendations":{"hydration":"Al menos 2 L de agua al día, más en días de entreno.","fruitsVeg":"5 raciones diarias entre frutas y verduras.","cooking":"Priorizar plancha, horno y vapor.","eatingOut":"Elegir proteína + verdura, evitar salsas pesadas.","organization":"Dejar comidas preparadas el domingo.","supplements":"","other":""},"substitutions":[{"id":"s1","group":"Proteínas","food":"Pechuga de pollo","qty":"150","unit":"g","sub":"Lomos de pavo","subQty":"150","unit2":"g","notes":""},{"id":"s2","group":"Hidratos de carbono","food":"Arroz","qty":"70","unit":"g","sub":"Pasta integral","subQty":"70","notes":"En seco"},{"id":"s3","group":"Frutas","food":"Plátano","qty":"1","unit":"ud","sub":"Manzana","subQty":"1","notes":""}],"createdAt":"2026-06-22T16:50:49.957Z","updatedAt":"2026-06-22T16:50:49.957Z","author":"Elena Vidal","deleted":false},"weeklyDiet":{"id":"diet_mqpgc8gj","days":[{"id":"day_mqpgc8gk","day":"Lunes","meals":[{"id":"m1","slot":"Desayuno","name":"Avena con fruta","time":"08:00","prep":"En frío, reposada toda la noche","notes":"","alternatives":"Yogur con granola","foods":[{"id":"f1","name":"Copos de avena","qty":"60","unit":"g"},{"id":"f2","name":"Plátano","qty":"1","unit":"ud"},{"id":"f3","name":"Leche","qty":"200","unit":"ml"}]},{"id":"m2","slot":"Comida","name":"Pollo con arroz y verduras","time":"14:00","prep":"Plancha","notes":"","alternatives":"Pavo o tofu","foods":[{"id":"f4","name":"Pechuga de pollo","qty":"150","unit":"g"},{"id":"f5","name":"Arroz","qty":"70","unit":"g"}]}]},{"id":"day_mqpgc8gl","day":"Martes","meals":[{"id":"m3","slot":"Desayuno","name":"Tostadas de aguacate","time":"08:00","prep":"","notes":"","alternatives":"","foods":[{"id":"f6","name":"Pan integral","qty":"2","unit":"reb"},{"id":"f7","name":"Aguacate","qty":"1/2","unit":"ud"}]}]},{"id":"day_mqpgc8gm","day":"Miércoles","meals":[]},{"id":"day_mqpgc8gn","day":"Jueves","meals":[]},{"id":"day_mqpgc8go","day":"Viernes","meals":[]},{"id":"day_mqpgc8gp","day":"Sábado","meals":[]},{"id":"day_mqpgc8gq","day":"Domingo","meals":[]}],"createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false},"measurements":[{"id":"me1","date":"2025-02-01","weight":"74","height":"166","waist":"88","hip":"102","fatPct":"34","musclePct":"28","usualWeight":"72","targetWeight":"66","notes":"Inicio","createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false},{"id":"me2","date":"2025-04-01","weight":"71","height":"166","waist":"84","hip":"99","fatPct":"31","musclePct":"29","notes":"","createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false},{"id":"me3","date":"2025-06-01","weight":"68.5","height":"166","waist":"80","hip":"96","fatPct":"28","musclePct":"31","notes":"Gran progreso","createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false}],"followUps":[{"id":"fu1","date":"2025-04-01","weight":"71","waist":"84","fatPct":"31","adherence":8,"hunger":4,"energy":8,"sleep":7,"stress":4,"symptoms":[],"wentWell":"Desayunos resueltos","difficulties":"Cenas fuera el finde","hardMeals":"Cena","changes":"Añadimos snack de tarde","nextGoal":"Mantener adherencia","nextReview":"2025-06-01","createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false},{"id":"fu2","date":"2025-06-01","weight":"68.5","waist":"80","fatPct":"28","adherence":9,"hunger":3,"energy":9,"sleep":8,"stress":3,"symptoms":["Gases"],"wentWell":"Mucha energía en entrenos","difficulties":"Poca","hardMeals":"—","changes":"Subimos hidratos en días de fuerza","nextGoal":"Recomposición","nextReview":"2025-07-01","createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false}],"notes":[{"id":"n1","title":"Valoración general","assessment":"Perfil muy trabajable, alta motivación.","priorities":"Estabilizar cenas de fin de semana.","pending":"Pedir analítica reciente.","clinical":"Vigilar lactosa.","reminders":"Preguntar por dolores de cabeza.","tags":["prioritaria","analítica"],"createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false}],"author":"Elena Vidal"}$json$::jsonb, '2026-06-22T16:50:49.958Z', '2026-06-22T16:50:49.958Z'
)
on conflict (id) do update set
  first_name = excluded.first_name, last_name = excluded.last_name, birth_date = excluded.birth_date,
  phone = excluded.phone, email = excluded.email, status = excluded.status, professional = excluded.professional,
  last_consult = excluded.last_consult, next_review = excluded.next_review, deleted = excluded.deleted,
  data = excluded.data, updated_at = excluded.updated_at;

insert into public.patients
  (id, first_name, last_name, birth_date, phone, email, status, professional, last_consult, next_review, deleted, data, created_at, updated_at)
values (
  'pat_javier', 'Javier', 'Roldán', '1985-09-30', '600 333 444', 'javier.roldan@email.com',
  'active', 'Elena Vidal', '2025-06-14', '2025-06-21', false,
  $json${"profession":"Ingeniero","photo":null,"admittedAt":"2024-11-15","observations":"","assessment":{"goals":["Ganancia de masa muscular","Rendimiento deportivo"],"goalDescription":"","motivation":9,"targetDate":"","goalNotes":"","measurement":{"id":"meas_mqpgc8h2","date":"2026-06-22","weight":"","height":"","usualWeight":"","targetWeight":"","waist":"","hip":"","fatPct":"","musclePct":"","notes":"","createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false},"conditions":[],"diagnoses":"","surgeries":"","familyHistory":"","medication":"","supplements":"","labs":"","medicalNotes":"","allergies":"","intolerances":"","avoidFoods":"","dislikedFoods":"","preferredFoods":"","dietType":"Omnívora","workSchedule":"","wakeTime":"","sleepTime":"","sleepHours":"","sleepQuality":7,"stress":5,"tobacco":"No","alcohol":"No","water":"","habitsNotes":"","activityLevel":"Muy activo","exerciseType":"","trainingDays":"","trainingDuration":"","trainingTime":"","sportGoal":"","injuries":"","activityNotes":"","mealsPerDay":"","whoCooks":"","eatsOut":"","cookingTime":"","budget":"","pastDiets":"","pastResults":"","rebound":"No","foodRelationship":"","eatingAnxiety":"","boredomEating":"","bingeing":"No","foodFears":"","dietaryNotes":"","foodRecord":{"breakfast":"","midMorning":"","lunch":"","snack":"","dinner":"","between":"","drinks":"","weekendDiff":""},"digestive":[],"stoolFrequency":"","bristol":"","digestiveNotes":"","completedSteps":[0,1,2,6],"updatedAt":null},"plan":{"id":"plan_mqpgc8h5","name":"","start":"","end":"","review":"","objective":"","energy":"","meals":5,"protein":"","carbs":"","fat":"","fiber":"","water":"","notes":"","recommendations":{"hydration":"","fruitsVeg":"","cooking":"","eatingOut":"","organization":"","supplements":"","other":""},"substitutions":[],"createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false},"weeklyDiet":{"id":"diet_mqpgc8h6","days":[{"id":"day_mqpgc8h7","day":"Lunes","meals":[]},{"id":"day_mqpgc8h8","day":"Martes","meals":[]},{"id":"day_mqpgc8h9","day":"Miércoles","meals":[]},{"id":"day_mqpgc8ha","day":"Jueves","meals":[]},{"id":"day_mqpgc8hb","day":"Viernes","meals":[]},{"id":"day_mqpgc8hc","day":"Sábado","meals":[]},{"id":"day_mqpgc8hd","day":"Domingo","meals":[]}],"createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false},"measurements":[{"id":"mj1","date":"2024-11-15","weight":"78","height":"180","waist":"85","fatPct":"18","musclePct":"40","createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false},{"id":"mj2","date":"2025-06-01","weight":"81","height":"180","waist":"84","fatPct":"16","musclePct":"43","createdAt":"2026-06-22T16:50:49.958Z","updatedAt":"2026-06-22T16:50:49.958Z","author":"Elena Vidal","deleted":false}],"followUps":[],"notes":[],"author":"Elena Vidal"}$json$::jsonb, '2026-06-22T16:50:49.958Z', '2026-06-22T16:50:49.958Z'
)
on conflict (id) do update set
  first_name = excluded.first_name, last_name = excluded.last_name, birth_date = excluded.birth_date,
  phone = excluded.phone, email = excluded.email, status = excluded.status, professional = excluded.professional,
  last_consult = excluded.last_consult, next_review = excluded.next_review, deleted = excluded.deleted,
  data = excluded.data, updated_at = excluded.updated_at;

insert into public.patients
  (id, first_name, last_name, birth_date, phone, email, status, professional, last_consult, next_review, deleted, data, created_at, updated_at)
values (
  'pat_carla', 'Carla', 'Soto', '1996-01-22', '600 555 666', 'carla.soto@email.com',
  'inactive', 'Elena Vidal', '2025-06-01', NULL, false,
  $json${"profession":"Comercial","photo":null,"admittedAt":"2025-05-01","observations":"Pausa temporal por viaje de trabajo.","assessment":{"goals":[],"goalDescription":"","motivation":7,"targetDate":"","goalNotes":"","measurement":{"id":"meas_mqpgc8hf","date":"2026-06-22","weight":"","height":"","usualWeight":"","targetWeight":"","waist":"","hip":"","fatPct":"","musclePct":"","notes":"","createdAt":"2026-06-22T16:50:49.959Z","updatedAt":"2026-06-22T16:50:49.959Z","author":"Elena Vidal","deleted":false},"conditions":[],"diagnoses":"","surgeries":"","familyHistory":"","medication":"","supplements":"","labs":"","medicalNotes":"","allergies":"","intolerances":"","avoidFoods":"","dislikedFoods":"","preferredFoods":"","dietType":"Omnívora","workSchedule":"","wakeTime":"","sleepTime":"","sleepHours":"","sleepQuality":7,"stress":5,"tobacco":"No","alcohol":"No","water":"","habitsNotes":"","activityLevel":"Moderadamente activo","exerciseType":"","trainingDays":"","trainingDuration":"","trainingTime":"","sportGoal":"","injuries":"","activityNotes":"","mealsPerDay":"","whoCooks":"","eatsOut":"","cookingTime":"","budget":"","pastDiets":"","pastResults":"","rebound":"No","foodRelationship":"","eatingAnxiety":"","boredomEating":"","bingeing":"No","foodFears":"","dietaryNotes":"","foodRecord":{"breakfast":"","midMorning":"","lunch":"","snack":"","dinner":"","between":"","drinks":"","weekendDiff":""},"digestive":[],"stoolFrequency":"","bristol":"","digestiveNotes":"","completedSteps":[],"updatedAt":null},"plan":{"id":"plan_mqpgc8hg","name":"","start":"","end":"","review":"","objective":"","energy":"","meals":5,"protein":"","carbs":"","fat":"","fiber":"","water":"","notes":"","recommendations":{"hydration":"","fruitsVeg":"","cooking":"","eatingOut":"","organization":"","supplements":"","other":""},"substitutions":[],"createdAt":"2026-06-22T16:50:49.959Z","updatedAt":"2026-06-22T16:50:49.959Z","author":"Elena Vidal","deleted":false},"weeklyDiet":{"id":"diet_mqpgc8hh","days":[{"id":"day_mqpgc8hi","day":"Lunes","meals":[]},{"id":"day_mqpgc8hj","day":"Martes","meals":[]},{"id":"day_mqpgc8hk","day":"Miércoles","meals":[]},{"id":"day_mqpgc8hl","day":"Jueves","meals":[]},{"id":"day_mqpgc8hm","day":"Viernes","meals":[]},{"id":"day_mqpgc8hn","day":"Sábado","meals":[]},{"id":"day_mqpgc8ho","day":"Domingo","meals":[]}],"createdAt":"2026-06-22T16:50:49.959Z","updatedAt":"2026-06-22T16:50:49.959Z","author":"Elena Vidal","deleted":false},"measurements":[],"followUps":[],"notes":[],"author":"Elena Vidal"}$json$::jsonb, '2026-06-22T16:50:49.959Z', '2026-06-22T16:50:49.959Z'
)
on conflict (id) do update set
  first_name = excluded.first_name, last_name = excluded.last_name, birth_date = excluded.birth_date,
  phone = excluded.phone, email = excluded.email, status = excluded.status, professional = excluded.professional,
  last_consult = excluded.last_consult, next_review = excluded.next_review, deleted = excluded.deleted,
  data = excluded.data, updated_at = excluded.updated_at;

insert into public.patients
  (id, first_name, last_name, birth_date, phone, email, status, professional, last_consult, next_review, deleted, data, created_at, updated_at)
values (
  'pat_diego', 'Diego', 'Fernández', '1992-07-08', '600 777 888', 'diego.fernandez@email.com',
  'pending', 'Elena Vidal', NULL, '2025-06-22', false,
  $json${"profession":"Profesor de educación física","photo":null,"admittedAt":"2025-06-10","observations":"","assessment":{"goals":["Rendimiento deportivo"],"goalDescription":"","motivation":7,"targetDate":"","goalNotes":"","measurement":{"id":"meas_mqpgc8hp","date":"2026-06-22","weight":"","height":"","usualWeight":"","targetWeight":"","waist":"","hip":"","fatPct":"","musclePct":"","notes":"","createdAt":"2026-06-22T16:50:49.959Z","updatedAt":"2026-06-22T16:50:49.959Z","author":"Elena Vidal","deleted":false},"conditions":[],"diagnoses":"","surgeries":"","familyHistory":"","medication":"","supplements":"","labs":"","medicalNotes":"","allergies":"","intolerances":"","avoidFoods":"","dislikedFoods":"","preferredFoods":"","dietType":"Omnívora","workSchedule":"","wakeTime":"","sleepTime":"","sleepHours":"","sleepQuality":7,"stress":5,"tobacco":"No","alcohol":"No","water":"","habitsNotes":"","activityLevel":"Moderadamente activo","exerciseType":"","trainingDays":"","trainingDuration":"","trainingTime":"","sportGoal":"","injuries":"","activityNotes":"","mealsPerDay":"","whoCooks":"","eatsOut":"","cookingTime":"","budget":"","pastDiets":"","pastResults":"","rebound":"No","foodRelationship":"","eatingAnxiety":"","boredomEating":"","bingeing":"No","foodFears":"","dietaryNotes":"","foodRecord":{"breakfast":"","midMorning":"","lunch":"","snack":"","dinner":"","between":"","drinks":"","weekendDiff":""},"digestive":[],"stoolFrequency":"","bristol":"","digestiveNotes":"","completedSteps":[0],"updatedAt":null},"plan":{"id":"plan_mqpgc8hs","name":"","start":"","end":"","review":"","objective":"","energy":"","meals":5,"protein":"","carbs":"","fat":"","fiber":"","water":"","notes":"","recommendations":{"hydration":"","fruitsVeg":"","cooking":"","eatingOut":"","organization":"","supplements":"","other":""},"substitutions":[],"createdAt":"2026-06-22T16:50:49.959Z","updatedAt":"2026-06-22T16:50:49.959Z","author":"Elena Vidal","deleted":false},"weeklyDiet":{"id":"diet_mqpgc8ht","days":[{"id":"day_mqpgc8hu","day":"Lunes","meals":[]},{"id":"day_mqpgc8hv","day":"Martes","meals":[]},{"id":"day_mqpgc8hw","day":"Miércoles","meals":[]},{"id":"day_mqpgc8hx","day":"Jueves","meals":[]},{"id":"day_mqpgc8hy","day":"Viernes","meals":[]},{"id":"day_mqpgc8hz","day":"Sábado","meals":[]},{"id":"day_mqpgc8i0","day":"Domingo","meals":[]}],"createdAt":"2026-06-22T16:50:49.959Z","updatedAt":"2026-06-22T16:50:49.959Z","author":"Elena Vidal","deleted":false},"measurements":[],"followUps":[],"notes":[],"author":"Elena Vidal"}$json$::jsonb, '2026-06-22T16:50:49.959Z', '2026-06-22T16:50:49.959Z'
)
on conflict (id) do update set
  first_name = excluded.first_name, last_name = excluded.last_name, birth_date = excluded.birth_date,
  phone = excluded.phone, email = excluded.email, status = excluded.status, professional = excluded.professional,
  last_consult = excluded.last_consult, next_review = excluded.next_review, deleted = excluded.deleted,
  data = excluded.data, updated_at = excluded.updated_at;

insert into public.patients
  (id, first_name, last_name, birth_date, phone, email, status, professional, last_consult, next_review, deleted, data, created_at, updated_at)
values (
  'pat_lucia', 'Lucía', 'Prieto', '1988-11-03', '600 999 000', 'lucia.prieto@email.com',
  'active', 'Elena Vidal', '2025-06-10', '2025-06-25', false,
  $json${"profession":"Enfermera","photo":null,"admittedAt":"2025-06-05","observations":"","assessment":{"goals":[],"goalDescription":"","motivation":7,"targetDate":"","goalNotes":"","measurement":{"id":"meas_mqpgc8i2","date":"2026-06-22","weight":"","height":"","usualWeight":"","targetWeight":"","waist":"","hip":"","fatPct":"","musclePct":"","notes":"","createdAt":"2026-06-22T16:50:49.959Z","updatedAt":"2026-06-22T16:50:49.959Z","author":"Elena Vidal","deleted":false},"conditions":[],"diagnoses":"","surgeries":"","familyHistory":"","medication":"","supplements":"","labs":"","medicalNotes":"","allergies":"","intolerances":"","avoidFoods":"","dislikedFoods":"","preferredFoods":"","dietType":"Omnívora","workSchedule":"","wakeTime":"","sleepTime":"","sleepHours":"","sleepQuality":7,"stress":5,"tobacco":"No","alcohol":"No","water":"","habitsNotes":"","activityLevel":"Moderadamente activo","exerciseType":"","trainingDays":"","trainingDuration":"","trainingTime":"","sportGoal":"","injuries":"","activityNotes":"","mealsPerDay":"","whoCooks":"","eatsOut":"","cookingTime":"","budget":"","pastDiets":"","pastResults":"","rebound":"No","foodRelationship":"","eatingAnxiety":"","boredomEating":"","bingeing":"No","foodFears":"","dietaryNotes":"","foodRecord":{"breakfast":"","midMorning":"","lunch":"","snack":"","dinner":"","between":"","drinks":"","weekendDiff":""},"digestive":[],"stoolFrequency":"","bristol":"","digestiveNotes":"","completedSteps":[],"updatedAt":null},"plan":{"id":"plan_mqpgc8i3","name":"","start":"","end":"","review":"","objective":"","energy":"","meals":5,"protein":"","carbs":"","fat":"","fiber":"","water":"","notes":"","recommendations":{"hydration":"","fruitsVeg":"","cooking":"","eatingOut":"","organization":"","supplements":"","other":""},"substitutions":[],"createdAt":"2026-06-22T16:50:49.959Z","updatedAt":"2026-06-22T16:50:49.959Z","author":"Elena Vidal","deleted":false},"weeklyDiet":{"id":"diet_mqpgc8i4","days":[{"id":"day_mqpgc8i5","day":"Lunes","meals":[]},{"id":"day_mqpgc8i6","day":"Martes","meals":[]},{"id":"day_mqpgc8i7","day":"Miércoles","meals":[]},{"id":"day_mqpgc8i8","day":"Jueves","meals":[]},{"id":"day_mqpgc8i9","day":"Viernes","meals":[]},{"id":"day_mqpgc8ia","day":"Sábado","meals":[]},{"id":"day_mqpgc8ib","day":"Domingo","meals":[]}],"createdAt":"2026-06-22T16:50:49.959Z","updatedAt":"2026-06-22T16:50:49.959Z","author":"Elena Vidal","deleted":false},"measurements":[],"followUps":[],"notes":[],"author":"Elena Vidal"}$json$::jsonb, '2026-06-22T16:50:49.959Z', '2026-06-22T16:50:49.959Z'
)
on conflict (id) do update set
  first_name = excluded.first_name, last_name = excluded.last_name, birth_date = excluded.birth_date,
  phone = excluded.phone, email = excluded.email, status = excluded.status, professional = excluded.professional,
  last_consult = excluded.last_consult, next_review = excluded.next_review, deleted = excluded.deleted,
  data = excluded.data, updated_at = excluded.updated_at;

-- ---- appointments ----
insert into public.appointments (id, data, updated_at)
values ('1', $json${"id":1,"patientId":"pat_marta","clientName":"Marta Iglesias","type":"Seguimiento mensual","date":"2025-06-16","start":"10:00","dur":60,"done":false}$json$::jsonb, '2026-06-22T16:50:49.960Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('2', $json${"id":2,"patientId":"pat_diego","clientName":"Diego Fernández","type":"Primera consulta","date":"2025-06-16","start":"12:30","dur":75,"done":false}$json$::jsonb, '2026-06-22T16:50:49.960Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('3', $json${"id":3,"patientId":"pat_lucia","clientName":"Lucía Prieto","type":"Revisión de plan","date":"2025-06-16","start":"17:00","dur":45,"done":true}$json$::jsonb, '2026-06-22T16:50:49.960Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('4', $json${"id":4,"patientId":"pat_lucia","clientName":"Lucía Prieto","type":"Seguimiento mensual","date":"2025-06-17","start":"16:00","dur":60,"done":false}$json$::jsonb, '2026-06-22T16:50:49.960Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('5', $json${"id":5,"patientId":"pat_diego","clientName":"Diego Fernández","type":"Seguimiento mensual","date":"2025-06-18","start":"11:00","dur":60,"done":false}$json$::jsonb, '2026-06-22T16:50:49.960Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('6', $json${"id":6,"patientId":"pat_carla","clientName":"Carla Soto","type":"Check-in rápido","date":"2025-06-18","start":"18:00","dur":30,"done":false}$json$::jsonb, '2026-06-22T16:50:49.960Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('7', $json${"id":7,"patientId":"pat_javier","clientName":"Javier Roldán","type":"Seguimiento mensual","date":"2025-06-19","start":"18:30","dur":60,"done":false}$json$::jsonb, '2026-06-22T16:50:49.960Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('8', $json${"id":8,"patientId":"pat_marta","clientName":"Marta Iglesias","type":"Check-in rápido","date":"2025-06-20","start":"09:30","dur":30,"done":false}$json$::jsonb, '2026-06-22T16:50:49.960Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('9', $json${"id":9,"patientId":"pat_diego","clientName":"Diego Fernández","type":"Primera consulta","date":"2025-06-20","start":"13:00","dur":75,"done":false}$json$::jsonb, '2026-06-22T16:50:49.960Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('10', $json${"id":10,"patientId":"pat_lucia","clientName":"Lucía Prieto","type":"Check-in rápido","date":"2025-06-13","start":"10:00","dur":30,"done":true}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('11', $json${"id":11,"patientId":"pat_javier","clientName":"Javier Roldán","type":"Revisión de plan","date":"2025-06-23","start":"12:00","dur":45,"done":false}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('12', $json${"id":12,"patientId":"pat_marta","clientName":"Marta Iglesias","type":"Seguimiento mensual","date":"2025-06-24","start":"18:00","dur":60,"done":false}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.appointments (id, data, updated_at)
values ('13', $json${"id":13,"patientId":"pat_diego","clientName":"Diego Fernández","type":"Seguimiento mensual","date":"2025-07-02","start":"11:00","dur":60,"done":false}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;

-- ---- content ----
insert into public.content (id, data, updated_at)
values ('1', $json${"id":1,"title":"5 mitos sobre el desayuno","platform":"Instagram","date":"19 jun","column":"idea"}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.content (id, data, updated_at)
values ('2', $json${"id":2,"title":"Cómo leer etiquetas sin agobiarte","platform":"Blog","date":"21 jun","column":"idea"}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.content (id, data, updated_at)
values ('3', $json${"id":3,"title":"Receta: bowl de avena express","platform":"TikTok","date":"20 jun","column":"draft"}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.content (id, data, updated_at)
values ('4', $json${"id":4,"title":"Newsletter de junio","platform":"Newsletter","date":"24 jun","column":"draft"}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.content (id, data, updated_at)
values ('5', $json${"id":5,"title":"Snacks para media tarde","platform":"Instagram","date":"22 jun","column":"ready"}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.content (id, data, updated_at)
values ('6', $json${"id":6,"title":"3 señales de que comes suficiente","platform":"TikTok","date":"23 jun","column":"ready"}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.content (id, data, updated_at)
values ('7', $json${"id":7,"title":"Testimonio: el plan de Marta","platform":"Instagram","date":"15 jun","column":"published"}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.content (id, data, updated_at)
values ('8', $json${"id":8,"title":"Newsletter de mayo","platform":"Newsletter","date":"30 may","column":"published"}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;

-- ---- services ----
insert into public.services (id, data, updated_at)
values ('1', $json${"id":1,"name":"Sesión única","price":"35€","period":null,"description":"Una consulta puntual para resolver dudas o hacer un primer diagnóstico.","features":["Valoración inicial","Recomendaciones personalizadas","Sin compromiso"],"highlighted":false}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.services (id, data, updated_at)
values ('2', $json${"id":2,"name":"Plan mensual","price":"49€","period":"/mes","description":"Acompañamiento continuo con seguimiento semanal y ajustes del plan.","features":["4 sesiones de seguimiento","Plan adaptado cada semana","Chat de apoyo entre sesiones"],"highlighted":true}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
insert into public.services (id, data, updated_at)
values ('3', $json${"id":3,"name":"Plan trimestral","price":"120€","period":"/trim.","description":"El acompañamiento más completo para resultados duraderos.","features":["12 sesiones de seguimiento","Plan adaptado cada semana","Chat de apoyo entre sesiones","Revisión de objetivos mensual"],"highlighted":false}$json$::jsonb, '2026-06-22T16:50:49.961Z')
on conflict (id) do update set data = excluded.data, updated_at = excluded.updated_at;
