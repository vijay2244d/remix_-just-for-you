import { useState, useEffect, useRef } from "react";
// Re-compile trigger for new images (45.png and 46.png)
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Heart,
  Sparkles,
  RotateCcw,
  BookHeart,
  Disc
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TiltCard } from "../components/TiltCard";
import introConductor from "../assets/images/intro_conductor.jpg";

const images = import.meta.glob<string>(
  '../../music book pictures/Modern Elegant Couple Wedding Photo Poster/*.png',
  { eager: true, import: 'default' }
);

const imageOrder = [
  "Akkam pakkam.png", // CD 2
  "oorumblood.png", // CD 3
  "comrade.png", // CD 4
  "zero.png", // CD 5
  "thaandavam.png", // CD 6
  "kaadhal aada.png", // CD 7
  "sirai.png", // CD 8 (labeled 7: neelothi)
  "hayyoda.png", // CD 9
  "paiya.png", // CD 10
  "pattuma.png", // CD 11
  "endha pakkam.png", // CD 12
  "perfect.png", // CD 13
  "nee paartha paarvai.png", // CD 14 (Three song)
  "vaaranam aairam.png", // CD 15
  "pavazhamzhi.png", // CD 16
  "mayanadhi.png", // CD 17
  "avalum naanum.png", // CD 18
  "raati.png", // CD 19
  "sidu sidu.png", // CD 20 (Romeo song)
  "aaruyire.png", // CD 21
  "ennadi maayavi.png", // CD 22
  "new york nagaram.png", // CD 23
  "jaalakkari.png", // CD 24
  "kadhal aasai.png", // CD 25 (anjan song)
  "munbae va.png", // CD 26
  "mudhal nee mudivum nee.png", // CD 27
  "maruvaarthai.png", // CD 28
  "pottala muttaya.png", // CD 29
  "aval.png", // CD 30
  "avalukena.png", // CD 31
  "hosana.png", // CD 32
  "anbil aval.png", // CD 33
  "megamo aval.png", // CD 34
  "nee kavithaigala.png", // CD 35
  "ennai saithale.png", // CD 36 (unlabeled 35)
  "oh my kadvule.png", // CD 37
  "kanimozhiye.png", // CD 38
  "jersey.png", // CD 39
  "mulumathi.png", // CD 40
  "i think they call this love.png", // CD 41
  "uyire.png", // CD 42
  "kalank.png", // CD 43
  "kannaana kannae.png", // CD 44 (naanum rowdy than)
  "veera.png", // CD 45 (verttama veraturiye)
  "nallai allai.png", // CD 46
  "aga naga.png", // CD 47
  "por.png", // CD 48
  "neethane en ponvasantham.png", // CD 49
  "en moochum venam.png", // CD 50
  "imaye.png", // CD 51
  "en manpura mangai.png", // CD 52
  "naan pizhai.png", // CD 53
  "chimmamma.png", // CD 54
  "eppadi vandhayo.png", // CD 55
  "mesaya muruku.png", // CD 56
  "tharame.png", // CD 57
  "thottijeya.png", // CD 58
  "velayutham.png", // CD 59
  "azhagiye.png" // CD 1
];

const sortedImageKeys = Object.keys(images)
  .sort((a, b) => {
    const nameA = a.split('/').pop() || "";
    const nameB = b.split('/').pop() || "";
    return imageOrder.indexOf(nameA) - imageOrder.indexOf(nameB);
  });

const sortedImages = sortedImageKeys.map((key) => images[key]);

export const SCRAPBOOK_IMAGES = sortedImages.length > 0
  ? [sortedImages[sortedImages.length - 1], ...sortedImages.slice(0, sortedImages.length - 1)]
  : [];

const sortedImageNames = sortedImageKeys.map(key => key.split('/').pop()?.replace('.png', '') || "");
export const SCRAPBOOK_IMAGE_NAMES = sortedImageNames.length > 0
  ? [sortedImageNames[sortedImageNames.length - 1], ...sortedImageNames.slice(0, sortedImageNames.length - 1)]
  : [];

export const PlaylistCover = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center gap-6 md:gap-8 p-4 md:p-8 select-none">
      <div className="w-full max-w-[180px] md:max-w-[240px] aspect-square relative z-10 perspective-1000 mx-auto">
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="w-full aspect-square rounded-full bg-gradient-to-br from-violet-300 via-purple-200 to-indigo-100 text-purple-900 flex flex-col items-center justify-center shadow-lg border-4 border-purple-200/50 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)]" />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 md:w-24 md:h-24 bg-white/40 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/55 shadow-md"
          >
            <Music className="w-10 h-10 md:w-12 md:h-12 text-purple-600 fill-purple-100" />
          </motion.div>
        </motion.div>
      </div>

      <div className="space-y-3 md:space-y-4 max-w-sm mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 font-bold text-[10px] md:text-xs uppercase tracking-widest shadow-sm mx-auto"
        >
          <span>அதிகாரம் 2 : காதல் ராகம்</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-4xl font-extrabold text-purple-955 font-display tracking-wider"
        >
          காதல் இசை
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-[2px] bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xs md:text-sm text-purple-900/80 leading-relaxed font-medium italic font-serif px-2 mb-2"
        >
          "Words sometimes fail us, but our music holds every emotion, every laughter, and every heartbeat we have shared."
        </motion.p>

        {/* Back to Library Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white font-medium text-[10px] md:text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer mt-2"
        >
          <BookHeart className="w-3.5 h-3.5" />
          <span>Back to Library 📚</span>
        </motion.button>
      </div>
    </div>
  );
};

export const PlaylistIntroPage = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 text-center select-none bg-[#fdfbf7] relative gap-4">
      {/* Decorative gold borders */}
      <div className="absolute inset-2 border border-purple-800/10 pointer-events-none rounded" />
      <div className="absolute inset-[10px] border border-dashed border-purple-800/5 pointer-events-none rounded" />

      <div className="w-full max-w-[150px] md:max-w-[200px] aspect-[4/5] rounded-xl overflow-hidden shadow-md border-2 border-purple-200/50 relative">
        <img src={introConductor} alt="Portrait" className="w-full h-full object-cover" />
      </div>
      <p className="text-xs md:text-sm font-bold font-serif text-purple-955 max-w-[220px] md:max-w-[280px] leading-relaxed italic">
        "உன் இதயம் மீட்டும் இசையிலே என் உலகம் சுழலுதடி... 🎵"
      </p>
    </div>
  );
};

interface MusicPlayerPageProps {
  imageSrc: string;
  pageNumber: number;
  isPlaying?: boolean;
  onPlayPause?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  volume?: number;
  onVolumeChange?: (vol: number) => void;
}

export const MusicPlayerPage = ({
  imageSrc,
  pageNumber,
}: MusicPlayerPageProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = 180; // 3 minutes length

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-run song time player animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-stone-900 group">
      {/* Respective image covers the left page fully */}
      <img
        src={imageSrc}
        alt={`Page ${pageNumber}`}
        className="w-full h-full object-cover pointer-events-none"
        loading="lazy"
      />

      {/* Subtle overlay for styling */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />

      {/* Floating Notes when playing (rises on top of image) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        <AnimatePresence>
          {isPlaying && Array.from({ length: 6 }).map((_, i) => {
            const noteSymbols = ["🎵", "♪", "♫", "♩", "♬", "💜"];
            const noteSym = noteSymbols[i % noteSymbols.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: "90%", x: `${20 + i * 12}%`, scale: 0.5 }}
                animate={{
                  opacity: [0, 0.7, 0],
                  y: "20%",
                  x: `${20 + i * 12 + Math.sin(i + currentTime) * 10}%`,
                  scale: [0.5, 1.0, 0.6]
                }}
                transition={{ duration: 5, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
                className="absolute text-purple-300 drop-shadow"
              >
                {noteSym}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Glassmorphic Music Player Overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-black/85 via-black/60 to-transparent flex flex-col gap-2.5 z-20 transition-all duration-300 group-hover:from-black/90">

        {/* Dynamic visualizer bars */}
        <div className="flex gap-[3px] items-end justify-center h-6 mb-1">
          {Array.from({ length: 18 }).map((_, i) => {
            const delays = [0.1, 0.3, 0.5, 0.2, 0.4, 0.6, 0.1, 0.3, 0.2, 0.5, 0.4, 0.1, 0.3, 0.6, 0.2, 0.5, 0.1, 0.3];
            return (
              <motion.div
                key={i}
                className="w-[3px] bg-gradient-to-t from-purple-400 to-pink-400 rounded-full"
                animate={isPlaying ? {
                  height: [4, 18, 6, 22, 4],
                } : {
                  height: 4
                }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: delays[i]
                }}
              />
            );
          })}
        </div>

        {/* Running Progress Bar */}
        <div className="w-full space-y-1">
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => setCurrentTime(parseInt(e.target.value, 10))}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer bg-white/20 accent-purple-400 focus:outline-none"
            style={{
              background: `linear-gradient(to right, #c084fc 0%, #c084fc ${(currentTime / duration) * 100
                }%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`,
            }}
          />
          <div className="flex justify-between text-[9px] text-white/55 font-bold tracking-wider font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Player Controls Grid */}
        <div className="flex items-center justify-between w-full">

          {/* Sleek Page tag */}
          <div className="px-2.5 py-0.5 rounded bg-white/10 text-[9px] text-white/70 font-serif tracking-wider backdrop-blur-sm shadow-sm border border-white/5">
            MOMENT {pageNumber}
          </div>

          {/* Large Play/Pause Button */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg hover:shadow-purple-500/20 border border-white/20 transition-all cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white translate-x-[1px]" />
            )}
          </motion.button>

          {/* Replay Button */}
          <button
            onClick={() => setCurrentTime(0)}
            className="text-white/55 hover:text-white transition-colors cursor-pointer p-1"
            title="Replay"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </div>
  );
};

const DEFAULT_SCRAPBOOK_CONTENT: Record<number, string> = {
  1: "No explanation needed the lyrics just expose them to you behalf of me",
  2: "And the song lyric you is I want that to continue to the end of our life hear\n\nThis song holds an special thing about the Vc your reaction and the mime you made still rules my gallery",
  3: " ♾️/100 marks",
  4: "When I listen to this song your face and our convo is run around my head\n\nNo matter how much distance we have even its an mm or or anything that’s how I felt and feel and there is no terms for the character you have and what happen if the world put we in the polar opposite side I will come to you and stands beside withyou like a comrade",
  5: "In this song and this lyric the beside with you is the real warmth and a safe place to mine",
  6: "This lyric express our life like when we met before and after like you don’t believe in love",
  7: "This song hold my this year which is 2026 birthday memory because of you and there is anything I cant give an explain to this lyrics the lyrics just give it itself",
  8: "This song this lyrics just says how the feel that you made when you around with me",
  9: "- This song lyrics doesnt need any explanation the song lyrics just made the explanation",
  10: "I think you know why I add this song and this line because this is the song which you first voice message to me because of the dare which I gave",
  11: "And this song is also special to me because I edit an video for your birthday and that video is one of the adorable video for me and the lyrics is the thing I want to and I telled you are not my sabam you’re the jiinee which as an love jiine and in tamil we called sugar just like you",
  12: "This song this lyric I will make sure that when you with me you will have the happy tears only not anymore for the sad tears and I will wipe the happy tear by me and eventhough you have any thing make you sad just come and tell and you are my half and I have the shoulder you just place yours on mine and I will take care you just besides with me and for the another reason you are my doctor who take care my inner world peacefully and I want to we wear the dress code which matches them and visit the temple and recreate the kovil scene in the video song",
  13: "We are Just like the lyrics",
  14: "Which remind the day I met and the spark evolved and which the moment is the meaning full moment and there is no explanation from me the song explanation is my explanation and believe we will also create a scene like in the song they celebrate Diwali",
  15: "Go to youtube and see this line you know why I specify this line This is how the I see you in the middle of the night and got beauty attack (heart attack) and I fell in the complete sleep mode you fullfill my dark night as an bright sun day",
  16: "This is song which remind the birthday handshake and yours saree version in from of me in my mind and If you see the video side by side that’s how I see that was is perfect simply perfect gorgeous and the explanation from my side is average when you listen to this lyrics the lyrics just explain what I mean",
  17: "“As long as I exist you will be loved” Damn this how I felt when you busy or decline my vc I just want to hear you voice whether conversation is meaning or nothing just your voice and if you want an clear explanation just listen the lyrics I want to be your lifetime listener its also applicable for vc",
  18: "This is the frame when we together I want to recreate this scene in real\n\nAnd we goes for an ride and listening to the music we love that’s all im become restless to drive the bike and nothing to say in word the lyrics just said what we as per my terms 🌚 and I don’t want to know the destination because where ever the location when its with you I love thats all",
  19: "No matter how I explain this lyrics the meaning which holds itself just diminish mine so I surrender the explanation to the lyrics just lyrics that how I spent on seeing you and thinking you",
  20: "This is how I want to live an life with you and no matter we cross and what we done through",
  21: "There is no such specific lyric I have to specify this is the song every I made an mistake which you got upset and I want to compromise like this but I cant because you not here and even but you see the song line 2.05 lyrics just match my alone when you not talk or here",
  22: "The lyrics and the song defines what you do in my heart and in my brain and the hotel scene is the one on my mind when I see or hear the song I just want to recreate that",
  23: "There is no any specific lyric to disclose this whole song is just disclose the alone when you not there eventhough the people are surrounded me my heart and eyes are seeking you I cant tolerate that when you are not here when I happy,sad,sick,angry just your presence and the voice boost me up to fall me more to you in the love ocean I have",
  24: "This is the background song I hear in my mind when you comes loose hair even in the vc or face to face nee oru alagu dii",
  25: "For real This is the lyric that show this lyric has an meaning that the child is happy to see the person he love yes as I child I admit my inner child is got and get more happy to see you and float on the joyfull If I were become an child I will come and got up to your hip and stay forever",
  26: "When I call a vc and you intentionally hide yourself this is the lyric I got in my mind and I ask myself and smile and just kept asking to showyouself",
  27: "We know this song hold an special place while we missing eachother I confidently says Im the one miss you more nobody can miss that much amount of miss I missed you and the term in the song defines the whole song to you in my pov is “neethanadi yen vaanin mathi” and I believe we just create the movie ending climax simple house you and me and yes after the fight over we get back together this lyric matches the situation",
  28: "This is how I want to show the care when you in the down just hold you in inside of my hands if I not in that situation truly im sorry for that I know that is the thing I got regret upon myself and you are my starting and as well as the ending and this song holds an line “piidivaatham pidi sinam thiirum adi” that’s the whole point I say just be like the lyric im happy and gratefull for that",
  29: "Yean heart uhh lup tap lup tap nu thudikathu divs divs than thudikum that’s why you",
  30: "The first and second portion reminds a lot of stuff that I made an mistake and you get upset and I comes to sort it out and even you get any doubt upon our relationship reliability just listen to the second lyric",
  31: "The first lyric remind every couples are put on their pics in the story with this song and I saw and felt hmmm and on this you tell to come and I saw you and put the story on my head and this song just show the starting stage and the last stage of love which is older age that’s how our love will go eventhough we dead our love should be gossip to anyone and says how are they in these type of love and I promise that, that’s how we live",
  32: "You look like the exact version of this bgm somebody says you are like jessie character from vtv if you were accepted that then I will be your Karthick and I always says this lyric",
  33: "The song is the best and finest explanation which is better than my words",
  34: "This lyrics is best for my stun moment and in this movie have the line which is “rekka mattum iruntha ava thevatha da” I hereby declare your rekka less thevatha",
  35: "For the first the song reminds me a person is this song when spoke in the earlier days and you decided to not to spoke and that talkless days are this was the song which was in the loop and everytime listen to this you were comes to mind that divya behave differs than this divs and this lyric was explain than its own",
  36: "Change the voice to male The song name and the lyrics tells the feeling and the second lyric is true you are my destiny to lead a happy life and I think for you as well",
  37: "The lyric just made me regret why I don’t make an move when I got spark from the initial stage and we will go for a bike trip 🤞",
  38: "The lyric just made an blast explanation",
  39: "This bgm just give the future bgm of our life",
  40: "The song is entirely for the GRWM you are just overtake the song by through your action which made fell even I remember now, damn girl you made me addict for you and you are my mulumathi",
  41: "The lyric just said how I towards you I proud be a idiot for you and you are my destiny",
  42: "The song lyric just enough to say what I have to say be my sai Pallavi and say congrats to me in the needed situation and I will also do that even and I will celebrate your achievement as mine summa whistle parakum",
  43: "The bgm just elevate the thoughts when I imagine as a couple",
  44: "Yes that’s true when we in the silent period the lyric just said what I was undergone and my thought in that and in the end “Nee venum naa vaazhaaaaaaaaaaaa”",
  45: "No explanation needed the lyrics just said what I meant to say \"But one thing is true... I will never be like the other people in your life. I will never leave you—not for anyone, not at any , and not for any reason.\"",
  46: "That’s how much amount of feel the line hold is that much no even more that much of amount of feel that I have when we didn’t speak and that’s the I cant live this is not cinematic dialogue this is from my bottom of heart",
  47: "This bgm hold an special place when you wear an saree especially farewell but I don’t saw in my eyes",
  48: "this is the another version of my vision through you",
  49: "the only way to rectify and fix my flaws are only kenjals and vanjals and the lyrics will say rest of my thoughts",
  50: "This is how I want in a day with you from you that all",
  51: "I know you like the song",
  52: "the song name is just like you the lyrics will speak my thoughts",
  53: "Naan pizhai - this song and its lyrics hold everything I feel but cannot say in words. Let the music speak for itself."
};

export const ScrapbookJournalPage = ({ pageNumber }: { pageNumber: number }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(`scrapbook_page_${pageNumber}`);
    setText(saved !== null ? saved : (DEFAULT_SCRAPBOOK_CONTENT[pageNumber] || ""));
  }, [pageNumber]);

  const handleChange = (val: string) => {
    setText(val);
    localStorage.setItem(`scrapbook_page_${pageNumber}`, val);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-6 select-none bg-[#fffdf9] relative">
      {/* Notebook margin line */}
      <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-purple-200/50 shadow-sm z-0" />
      <div className="absolute inset-2 border border-purple-800/10 pointer-events-none rounded z-0" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-full flex flex-col pt-4 pb-2 z-10 pl-6 md:pl-8"
      >
        <div className="text-center shrink-0 border-b border-purple-800/10 pb-2 mb-4">
          <div className="inline-flex items-center gap-1.5 text-purple-800 font-bold text-xs uppercase tracking-widest">
            <Heart className="w-3.5 h-3.5 fill-purple-400 text-purple-500 animate-pulse" />
            <span>Memory Notes ✍️</span>
          </div>
          <p className="text-[10px] text-purple-600/50 italic font-serif mt-0.5">
            Your words are the sweetest music
          </p>
        </div>

        {/* Notebook paper textarea */}
        <div
          className="flex-1 w-full relative"
          style={{
            backgroundImage: "linear-gradient(transparent 95%, #ebdcb9 100%)",
            backgroundSize: "100% 32px",
            lineHeight: "32px",
          }}
        >
          <textarea
            value={text}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Type your memory or message here..."
            className="w-full h-full bg-transparent border-0 outline-none resize-none font-serif text-xs sm:text-sm md:text-base text-purple-950 px-2 py-1 leading-[32px] focus:ring-0 focus:outline-none"
            style={{
              lineHeight: "32px",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export const PlaylistEnd = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full max-w-sm mx-auto flex flex-col justify-center gap-6 p-4 md:p-8 select-none">
      <div className="w-full relative flex-1 min-h-0 perspective-1000">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          className="h-full bg-[length:100%_28px] md:bg-[length:100%_32px] bg-left-top shadow-md border border-purple-100 p-5 md:p-8 rounded-lg overflow-hidden flex flex-col items-center justify-center text-center relative"
          style={{
            backgroundImage: "linear-gradient(transparent 95%, #d8b4fe 100%)",
            backgroundColor: "#fffdf9"
          }}
        >
          {/* Vertical margin line for the paper */}
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-purple-200/50 shadow-sm z-0" />
          <div className="absolute inset-2 border border-purple-800/10 pointer-events-none rounded z-0" />

          <div className="relative z-10 w-full px-4 flex flex-col items-center gap-6">
            <div className="w-10 h-10 rounded-full bg-purple-50 border border-purple-100 text-purple-500 flex items-center justify-center shadow-inner pointer-events-none">
              <Sparkles className="w-5 h-5 text-purple-600 fill-purple-200 animate-spin" style={{ animationDuration: "6s" }} />
            </div>

            <h2 className="text-xl md:text-2xl font-bold font-serif text-purple-900 uppercase tracking-widest">
              பாடல் முற்றுப் பெற்றது
            </h2>

            <p className="text-purple-800/90 text-sm md:text-base font-semibold leading-relaxed italic font-serif">
              உன் குரலே என் இசையின் உயிர்நாடி, காலமெல்லாம் உன்னோடு பாடுவேன்...
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 text-white font-medium text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer border-0 mt-4"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Back to Library</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
