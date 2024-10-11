import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, GraduationCap, Calculator } from 'lucide-react';

interface Course {
  id: number;
  name: string;
  credits: number;
  grade: string;
}

const gradePoints: { [key: string]: number } = {
  'AP': 10, 'AA': 10,
  'AB': 9,
  'BB': 8,
  'BC': 7,
  'CC': 6,
  'CD': 5,
  'DD': 4,
  'FR': 0
};

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [spi, setSPI] = useState<number | null>(null);
  const [currentCPI, setCurrentCPI] = useState<string>('');
  const [totalCredits, setTotalCredits] = useState<string>('');
  const [newCPI, setNewCPI] = useState<number | null>(null);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: '', credits: 6, grade: 'BC' }]);
  };

  const removeCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const updateCourse = (id: number, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const calculateSPI = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach(course => {
      if (course.credits && course.grade) {
        totalCredits += course.credits;
        totalGradePoints += course.credits * gradePoints[course.grade];
      }
    });

    if (totalCredits === 0) {
      setSPI(null);
    } else {
      setSPI(Number((totalGradePoints / totalCredits).toFixed(2)));
    }
  };

  const calculateCPI = () => {
    if (spi !== null && currentCPI !== '' && totalCredits !== '') {
      const currentCPIValue = parseFloat(currentCPI);
      const totalCreditsValue = parseFloat(totalCredits);
      const currentSemesterCredits = courses.reduce((sum, course) => sum + course.credits, 0);
      
      const newCPIValue = (currentCPIValue * totalCreditsValue + spi * currentSemesterCredits) / (totalCreditsValue + currentSemesterCredits);
      setNewCPI(Number(newCPIValue.toFixed(2)));
    } else {
      setNewCPI(null);
    }
  };

  useEffect(() => {
    calculateSPI();
  }, [courses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-3xl mx-auto bg-white bg-opacity-90 shadow-lg rounded-lg overflow-hidden backdrop-blur-sm">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center justify-center">
            <GraduationCap className="mr-2" size={36} />
            SPI and CPI Calculator
          </h1>
          {courses.map(course => (
            <div key={course.id} className="flex items-center space-x-4 mb-4">
              <input
                type="text"
                placeholder="Course Name"
                value={course.name}
                onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                className="flex-grow p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Credits"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, 'credits', Number(e.target.value))}
                className="w-20 p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={course.grade}
                onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                className="p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.keys(gradePoints).map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
              <button onClick={() => removeCourse(course.id)} className="text-red-500 hover:text-red-700 transition-colors duration-200">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <div className="mt-6 flex justify-between items-center">
            <button 
              onClick={addCourse} 
              className="flex items-center text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full transition-colors duration-200 shadow-md"
            >
              <PlusCircle size={20} className="mr-1" /> Add Course
            </button>
            {spi !== null && (
              <div className="text-center bg-green-100 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-green-800">Your SPI</h2>
                <p className="text-4xl font-bold text-green-600">{spi}</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-blue-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">Calculate CPI</h2>
            <div className="flex space-x-4 mb-4">
              <input
                type="number"
                placeholder="Current CPI"
                value={currentCPI}
                onChange={(e) => setCurrentCPI(e.target.value)}
                className="flex-grow p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Total Credits"
                value={totalCredits}
                onChange={(e) => setTotalCredits(e.target.value)}
                className="flex-grow p-2 border rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button 
              onClick={calculateCPI}
              className="flex items-center justify-center w-full text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-full transition-colors duration-200 shadow-md"
            >
              <Calculator size={20} className="mr-1" /> Calculate CPI
            </button>
            {newCPI !== null && (
              <div className="mt-4 text-center">
                <h3 className="text-xl font-semibold text-blue-800">Your New CPI</h3>
                <p className="text-4xl font-bold text-blue-600">{newCPI}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <footer className="text-center mt-8 text-white text-opacity-90">
        <p>
          Created with ❤️ by{' '}
          <a
            href="https://www.linkedin.com/in/prajyot-chakre-973458228/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-blue-200 transition-colors duration-200"
          >
            Prajyot Chakre
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;