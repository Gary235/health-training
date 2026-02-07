# Quick Start Guide - Health & Training App

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies (1 min)
```bash
cd health-training-app
npm install
```

### Step 2: Start Development Server (30 seconds)
```bash
npm run dev
```

The app will open at **http://localhost:5173**

### Step 3: Complete Onboarding (2 minutes)

**Step 1 - Body Specifications:**
- Select measurement system (metric/imperial)
- Enter age, height, weight
- Choose gender
- Select fitness level (beginner/intermediate/advanced/athlete)
- Select activity level

**Step 2 - Preferences:**
- Select dietary restrictions (vegetarian, vegan, gluten-free, etc.)
- Add allergies
- Add foods you like/dislike
- Add cuisine preferences
- Select workout location (home/gym/outdoor/mixed)
- Add available equipment

**Step 3 - Schedule:**
- Select training days (click days of the week)
- Choose preferred workout time
- Set meal times (breakfast, lunch, dinner)
- Set sleep schedule

**Step 4 - Goals:**
- Select primary goal (weight loss, muscle gain, maintenance, etc.)
- If weight goal: Set target weight and weekly change goal
- Add specific goals (e.g., "run 5k", "bench 100kg")

Click **Complete** to save your profile!

### Step 4: Generate Your First Meal Plan (1 minute)

1. From dashboard, click **"Generate Meal Plan"**
2. Choose duration (7 days recommended for first plan)
3. Click **"Generate Meal Plan"**
4. Wait 10-30 seconds for AI generation
5. View your personalized meals!

**What you'll get:**
- 7 days of complete meals (breakfast, lunch, dinner)
- Detailed recipes with ingredients
- Nutrition information for each meal
- Scheduled meal times
- Shopping list ready

### Step 5: Generate Your First Training Plan (1 minute)

1. From dashboard, click **"Generate Training Plan"**
2. Choose duration (4 weeks recommended)
3. Click **"Generate Training Plan"**
4. Wait 10-30 seconds for AI generation
5. View your personalized workouts!

**What you'll get:**
- 4 weeks of training sessions
- Exercises matched to your fitness level
- Equipment you actually have
- Scheduled for your available days
- Progressive overload built-in

---

## 📝 Daily Usage Flow

### Morning Routine
1. Open app (or use installed PWA)
2. Go to **Daily View**
3. See today's meals and workouts
4. Check shopping list if needed

### After Each Meal
1. Open **Daily View**
2. Find the meal you just ate
3. Click **"✓ Completed"** for full adherence
4. Or click **"More Options"** to log:
   - Actual time eaten
   - Portion size (if different)
   - Deviations (if any)

### After Each Workout
1. Open **Daily View**
2. Find the workout you completed
3. Click **"✓ Completed"** for full adherence
4. Or click **"More Options"** to log:
   - Actual start/end times
   - Perceived exertion (1-10)
   - Exercises completed
   - Deviations (if any)

### Weekly Check-In
1. Go to **Metrics** page
2. Click **"+ Add Metrics"**
3. Enter current weight and body fat %
4. Add body measurements if desired
5. View progress charts!

### Monthly Review
1. Go to **History** page
2. View calendar with color-coded adherence
3. Click any day to see details
4. Check monthly statistics

---

## 🔄 Using Adaptive Planning

The app **automatically detects patterns** and suggests adjustments. Here's how it works:

### When Adjustments are Suggested

The app triggers adjustments when:
- You skip the same meal/workout 3+ days in a row
- Your adherence falls below 60%
- You consistently eat/train at different times
- You have high miss rates on specific items

### How to Adjust

1. **Banner appears** on dashboard when adjustment needed
2. Click **"View Details"** to see analysis
3. Review detected patterns:
   - What's being missed
   - Why (deviation reasons)
   - Timing issues
   - Recommendations
4. Click **"Adjust Meal Plan"** or **"Adjust Training Plan"**
5. AI generates new plan addressing the issues
6. New plan automatically activated

### Example Scenarios

**Scenario 1: Always Skipping Breakfast**
- Pattern: 4 consecutive breakfast skips
- Reason: "time constraint"
- Adjustment: Simpler breakfast recipes (5-10 min prep)
- Result: Quick oatmeal, smoothies, grab-and-go options

**Scenario 2: Consistently Late for Lunch**
- Pattern: Always eating lunch 2 hours late
- Detection: 120-minute delay across 5+ days
- Adjustment: Shift lunch from 12:00 to 14:00
- Result: Schedule matches reality

**Scenario 3: Skipping Leg Day**
- Pattern: Leg workouts skipped 3 weeks in a row
- Reason: "too tired"
- Adjustment: Reduce intensity by 30%, fewer sets
- Result: Sustainable training volume

---

## 🛠️ Troubleshooting

### "AI service is not configured"
**Solution**: Configure AI settings in the app:
1. Go to **Settings** page
2. Select your AI provider (mock, openai, or anthropic)
3. If using OpenAI, enter your API key
4. Save settings

The mock provider works without any configuration.

### "Failed to generate plan"
**Possible causes:**
1. No internet connection (OpenAI requires internet)
2. Invalid API key
3. API rate limit hit

**Solutions:**
- Switch to mock provider for testing: `VITE_AI_PROVIDER=mock`
- Check API key is valid
- Wait a minute and try again

### Plans not showing on Daily View
**Solution**: Make sure:
1. You've generated both meal and training plans
2. Plans have status "active"
3. Today's date falls within plan date range
4. Plans are saved (check browser console for errors)

### Data not persisting
**Solution**:
1. Check browser supports IndexedDB (all modern browsers do)
2. Clear browser data and try again
3. Check browser console for database errors
4. Ensure not in private/incognito mode

### App not installing (PWA)
**Solution**:
1. Must use HTTPS (or localhost)
2. Must have service worker registered
3. Must meet PWA criteria
4. Try clicking install icon in browser address bar

---

## 💡 Tips for Success

### Meal Planning
- Start with 7-day plans (easier to follow)
- Be specific about food likes/dislikes in profile
- Update allergies carefully
- Try different cuisine preferences
- Use shopping list to stay organized

### Training Planning
- Be honest about fitness level
- List all equipment you actually have
- Choose realistic available days
- Start with lower volume if unsure
- Track perceived exertion honestly

### Logging
- Log immediately after meals/workouts (don't wait)
- Be honest about adherence
- Always note deviation reasons
- Track actual times to see patterns
- Use quick complete button when possible

### Adaptation
- Let the app analyze for 7+ days before adjusting
- Review recommended adjustments before accepting
- Don't dismiss suggestions too quickly
- Trust the algorithm - it learns from your data
- Adjust plans monthly or when adherence drops

### Metrics Tracking
- Weigh yourself same time each week (morning, after bathroom)
- Track body fat monthly (more stable than weight)
- Take body measurements monthly
- Add photos for visual progress (optional)
- Don't obsess over daily fluctuations

---

## 🎯 Next Steps After Setup

1. **Week 1**: Focus on logging everything
2. **Week 2**: Review your adherence patterns
3. **Week 3**: Let app suggest adjustments
4. **Week 4**: Track first body metrics
5. **Month 2**: Review progress charts
6. **Month 3**: Refine goals based on progress

---

## 📞 Need Help?

### Resources
- **Full Feature List**: See `FEATURES.md`
- **Technical Details**: See `README.md`
- **Code Documentation**: Check inline comments

### Common Questions

**Q: Can I use this without internet?**
A: Yes! After first load, everything works offline except AI plan generation.

**Q: Is my data secure?**
A: Yes! All data stored locally on your device. No server uploads.

**Q: How much does it cost?**
A: Free! Optional OpenAI API costs ~$0.10-0.50 per plan generation.

**Q: Can I export my data?**
A: Yes! Database export/import functions included.

**Q: Does it track my location?**
A: No tracking whatsoever. 100% private.

**Q: Can multiple people use it?**
A: Currently single-user. Each browser profile = separate user.

**Q: Will my plans expire?**
A: No! All plans saved permanently until you archive them.

---

## 🎉 You're All Set!

Your Health & Training App is ready to use. Start logging, tracking, and watching the AI adapt to your lifestyle.

**Remember**: Consistency beats perfection. Log what you can, adjust when needed, and trust the process!
