const mongoose = require('../server/node_modules/mongoose');
const dotenv = require('../server/node_modules/dotenv');

const contentSchema = new mongoose.Schema({ title: String, category: String, text: String });
const quizSchema = new mongoose.Schema({ contentId: mongoose.Schema.Types.ObjectId, title: String, questions: Array });

const connect = async () => {
  try {
    const conn = await mongoose.connect('mongodb://localhost:27017/disaster-edu');
    const Content = mongoose.model('Content', contentSchema, 'contents');
    const Quiz = mongoose.model('Quiz', quizSchema, 'quizzes');

    const contents = await Content.find({});
    for (let c of contents) {
      let newCat = 'general';
      const t = c.title.toLowerCase();
      if (t.includes('earthquake')) newCat = 'earthquake';
      else if (t.includes('flood')) newCat = 'flood';
      else if (t.includes('fire')) newCat = 'fire';
      else if (t.includes('cyclone')) newCat = 'cyclone';
      
      await conn.connection.db.collection('contents').updateOne({_id: c._id}, {$set:{category: newCat}});
    }

    await Quiz.deleteMany({});
    
    const currentContents = await Content.find({});
    let qCount = 0;
    
    for (let c of currentContents) {
      const cat = c.category || 'general';
      let questions = [];
      
      if (cat === 'earthquake') {
        questions = [
          { questionText: 'What is the most important thing to do during an earthquake if you are indoors?', options: ['Run outside immediately', 'Drop, Cover, and Hold On', 'Stand in a doorway', 'Get near a window'], correctAnswerIndex: 1 },
          { questionText: 'Which of these items should be in your emergency kit?', options: ['Video games', 'Flashlight and batteries', 'Ice cream', 'Heavy winter coats'], correctAnswerIndex: 1 },
          { questionText: 'If you are driving when an earthquake starts, what should you do?', options: ['Drive faster to outrun it', 'Stop quickly in the middle of the road', 'Pull over to a clear location, stop, and stay in the car', 'Abandon your car and run'], correctAnswerIndex: 2 },
          { questionText: 'Why should you avoid using elevators during an earthquake?', options: ['They move too slow', 'Power can fail and leave you trapped', 'They might go to the roof', 'The cables will swing'], correctAnswerIndex: 1 },
          { questionText: 'After an earthquake, what is the first utility you should check?', options: ['The internet connection', 'The television', 'Gas lines for leaks', 'The air conditioning'], correctAnswerIndex: 2 }
        ];
      } else if (cat === 'flood') {
        questions = [
          { questionText: 'What does "Turn Around, Don\'t Drown" mean?', options: ['Always walk backwards near water', 'Do not attempt to walk or drive through flowing water', 'You can safely swim in floodwaters', 'Floodwaters are safe'], correctAnswerIndex: 1 },
          { questionText: 'If a flood warning is issued, what is an immediate action you should take?', options: ['Move to higher ground immediately', 'Go to the basement', 'Wait until water enters your home', 'Go outside to watch'], correctAnswerIndex: 0 },
          { questionText: 'How much fast-moving water can knock over an adult?', options: ['Just 6 inches of water', 'At least 2 feet of water', '3 feet of water', 'Water must be waist deep'], correctAnswerIndex: 0 },
          { questionText: 'What should you do with electrical appliances during a flood?', options: ['Leave them plugged in', 'Unplug them if you are dry and not standing in water', 'Use them to pump water out', 'Throw them in the sink'], correctAnswerIndex: 1 },
          { questionText: 'Why is it dangerous to walk through standing flood water?', options: ['It might ruin your shoes', 'The water can contain chemicals, sewage, and hidden debris', 'It is usually too cold', 'It will wash away the roads'], correctAnswerIndex: 1 }
        ];
      } else if (cat === 'fire') {
        questions = [
          { questionText: 'What is the immediate action to take if your clothes catch fire?', options: ['Run fast to blow it out', 'Stop, Drop, and Roll', 'Yell for help without moving', 'Look for a fire extinguisher'], correctAnswerIndex: 1 },
          { questionText: 'When escaping a building fire, how should you check if a door is safe to open?', options: ['Kick the door open', 'Use the back of your hand to feel the door for heat', 'Look through the keyhole', 'Just open it quickly'], correctAnswerIndex: 1 },
          { questionText: 'How often should you test your smoke alarms?', options: ['Once every 5 years', 'Once a year', 'Once a month', 'Only when you move in'], correctAnswerIndex: 2 },
          { questionText: 'If heavy smoke fills a room during a fire, what should you do?', options: ['Stand up tall and run', 'Crawl low under the smoke', 'Cover your eyes and walk normally', 'Open all windows immediately'], correctAnswerIndex: 1 },
          { questionText: 'What is the safest way to establish an escape plan for your family?', options: ['Identify exactly ONE escape route', 'Identify TWO ways out of every room', 'Wait until a fire happens to decide', 'Draw it once and forget it'], correctAnswerIndex: 1 }
        ];
      } else if (cat === 'cyclone') {
        questions = [
          { questionText: 'When is it safe to go outside during a cyclone?', options: ['During the eye of the storm when it gets calm', 'When the winds seem to die down', 'Only when authorities declare it is safe', 'When you need to check on your car'], correctAnswerIndex: 2 },
          { questionText: 'Which of the following is NOT a recommended preparation for a cyclone?', options: ['Gathering emergency supplies', 'Opening all windows to let the pressure equalize', 'Identifying shelter locations', 'Knowing your area\'s risk'], correctAnswerIndex: 1 },
          { questionText: 'What is a storm surge?', options: ['A sudden burst of rain', 'An abnormal rise of water generated by a storm', 'A type of electrical lightning', 'High speed wind gusts'], correctAnswerIndex: 1 },
          { questionText: 'What part of your house provides the best shelter during a severe cyclone?', options: ['A room with large windows', 'An interior room on the lowest floor away from windows', 'The attic or roof space', 'The garage next to your car'], correctAnswerIndex: 1 },
          { questionText: 'Why should you fill your bathtub and large containers with water before a cyclone hits?', options: ['To take a bath later', 'To have a clean supply of drinking and sanitary water if the mains fail', 'To add weight to the floor', 'To keep the bathroom humid'], correctAnswerIndex: 1 }
        ];
      } else {
        questions = [
          { questionText: 'What is the primary purpose of an emergency family communication plan?', options: ['To decide who gets what food', 'To know how to contact one another and where to meet', 'To plan a vacation after the disaster', 'To memorize phone numbers'], correctAnswerIndex: 1 },
          { questionText: 'How much water per person per day is generally recommended for an emergency supply kit?', options: ['1 cup', '1 liter', '1 gallon', '5 gallons'], correctAnswerIndex: 2 },
          { questionText: 'How many days of non-perishable food should you store in your emergency kit?', options: ['1 day', 'At least 3 days', '1 week', '1 month'], correctAnswerIndex: 1 },
          { questionText: 'Which government agency in the US provides the primary guidelines for emergency preparedness?', options: ['FBI', 'CIA', 'FEMA', 'NASA'], correctAnswerIndex: 2 },
          { questionText: 'Why is it important to keep copies of important documents in your emergency kit?', options: ['To read if you get bored', 'To quickly prove identity and access insurance if your home is destroyed', 'So someone else can pay your bills', 'To easily throw them away'], correctAnswerIndex: 1 }
        ];
      }

      await Quiz.create({
        contentId: c._id,
        title: `Quiz: ${c.title}`,
        questions
      });
      qCount++;
    }

    console.log(`FINISHED: Updated ${qCount} quizzes silently.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

connect();
