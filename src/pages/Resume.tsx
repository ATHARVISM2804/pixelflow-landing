import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Download } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useToast } from "@/components/ui/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export function Resume() {
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    summary: '',
    experiences: [{
      title: '',
      company: '',
      location: '',
      period: '',
      description: ''
    }],
    skills: '',
    education: [{
      degree: '',
      school: '',
      location: '',
      year: '',
      gpa: '',
      honors: ''
    }],
    activities: ''
  });

  const [loading, setLoading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleExperienceChange = (idx: number, field: string, value: string) => {
    setForm(prev => {
      const arr = [...prev.experiences];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, experiences: arr };
    });
  };
  
  const addExperience = () => {
    setForm(prev => ({ ...prev, experiences: [...prev.experiences, { title: '', company: '', location: '', period: '', description: '' }] }));
  };

  const handleEducationChange = (idx: number, field: string, value: string) => {
    setForm(prev => {
      const arr = [...prev.education];
      arr[idx] = { ...arr[idx], [field]: value };
      return { ...prev, education: arr };
    });
  };

  const addEducation = () => {
    setForm(prev => ({ ...prev, education: [...prev.education, { degree: '', school: '', location: '', year: '', gpa: '', honors: '' }] }));
  };

  const handleDownload = async () => {
    if (!resumeRef.current) return;

    try {
      setLoading(true);

      if (!window.confirm("Are you sure you want to download this resume as PDF?")) {
        setLoading(false);
        return;
      }

      toast({
        title: "Processing",
        description: "Generating your PDF resume...",
      });

      const resumeElement = resumeRef.current;
      const originalStyle = resumeElement.style.cssText;

      // Set A4 dimensions
      resumeElement.style.width = '210mm';
      resumeElement.style.minHeight = '297mm';
      resumeElement.style.padding = '20mm';
      resumeElement.style.backgroundColor = '#ffffff';

      const canvas = await html2canvas(resumeElement, {
        scale: 4,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      resumeElement.style.cssText = originalStyle;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = 210;
      const pdfHeight = 297;

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${form.name || 'Resume'}.pdf`);

      toast({
        title: "Success!",
        description: "Your resume has been downloaded.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900">
      <Sidebar />
      <div className="lg:ml-[280px] flex flex-col min-h-screen">
        <DashboardHeader title="Resume Maker" icon={FileText} showNewServiceButton={false} />
        <main className="flex-1 p-3 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
              <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-2xl font-bold text-white">Make Resume @2/-</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Name and Contact */}
                  <div className="grid grid-cols-1 gap-3">
                    <Input placeholder="Full Name" className="bg-gray-800/50 border-gray-700/50 text-white text-xl font-bold text-center" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <Input placeholder="Address" className="bg-gray-800/50 border-gray-700/50 text-white text-center" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                    <div className="flex gap-2">
                      <Input placeholder="Phone" className="bg-gray-800/50 border-gray-700/50 text-white text-center" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                      <Input placeholder="Email" className="bg-gray-800/50 border-gray-700/50 text-white text-center" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <Label className="text-white">Professional Summary</Label>
                    <Textarea placeholder="Write a short summary..." className="bg-gray-800/50 border-gray-700/50 text-white" value={form.summary} onChange={e => setForm({ ...form, summary: e.target.value })} />
                  </div>

                  {/* Experience */}
                  <div>
                    <Label className="text-white text-lg">Experience</Label>
                    <div className="space-y-3 mt-2">
                      {form.experiences.map((exp, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex gap-2">
                            <Input placeholder="Job Title" className="bg-gray-800/50 border-gray-700/50 text-white" value={exp.title} onChange={e => handleExperienceChange(idx, 'title', e.target.value)} />
                            <Input placeholder="Company" className="bg-gray-800/50 border-gray-700/50 text-white" value={exp.company} onChange={e => handleExperienceChange(idx, 'company', e.target.value)} />
                          </div>
                          <div className="flex gap-2">
                            <Input placeholder="Location" className="bg-gray-800/50 border-gray-700/50 text-white" value={exp.location} onChange={e => handleExperienceChange(idx, 'location', e.target.value)} />
                            <Input placeholder="Period (e.g. 2020-2022)" className="bg-gray-800/50 border-gray-700/50 text-white" value={exp.period} onChange={e => handleExperienceChange(idx, 'period', e.target.value)} />
                          </div>
                          <Textarea placeholder="Description" className="bg-gray-800/50 border-gray-700/50 text-white" value={exp.description} onChange={e => handleExperienceChange(idx, 'description', e.target.value)} />
                        </div>
                      ))}
                      <Button onClick={addExperience} className="bg-indigo-500 text-white hover:bg-indigo-600 text-xs sm:text-sm">Add Experience +</Button>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <Label className="text-white text-lg">Skills</Label>
                    <Textarea placeholder="Type your skills separated by comma..." className="bg-gray-800/50 border-gray-700/50 text-white" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
                  </div>

                  {/* Education */}
                  <div>
                    <Label className="text-white text-lg">Education</Label>
                    <div className="space-y-3 mt-2">
                      {form.education.map((edu, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex gap-2">
                            <Input placeholder="Degree" className="bg-gray-800/50 border-gray-700/50 text-white" value={edu.degree} onChange={e => handleEducationChange(idx, 'degree', e.target.value)} />
                            <Input placeholder="School/University" className="bg-gray-800/50 border-gray-700/50 text-white" value={edu.school} onChange={e => handleEducationChange(idx, 'school', e.target.value)} />
                          </div>
                          <div className="flex gap-2">
                            <Input placeholder="Location" className="bg-gray-800/50 border-gray-700/50 text-white" value={edu.location} onChange={e => handleEducationChange(idx, 'location', e.target.value)} />
                            <Input placeholder="Year" className="bg-gray-800/50 border-gray-700/50 text-white" value={edu.year} onChange={e => handleEducationChange(idx, 'year', e.target.value)} />
                          </div>
                          <div className="flex gap-2">
                            <Input placeholder="GPA" className="bg-gray-800/50 border-gray-700/50 text-white" value={edu.gpa} onChange={e => handleEducationChange(idx, 'gpa', e.target.value)} />
                            <Input placeholder="Honors" className="bg-gray-800/50 border-gray-700/50 text-white" value={edu.honors} onChange={e => handleEducationChange(idx, 'honors', e.target.value)} />
                          </div>
                        </div>
                      ))}
                      <Button onClick={addEducation} className="bg-indigo-500 text-white hover:bg-indigo-600 text-xs sm:text-sm">Add Education +</Button>
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <Label className="text-white text-lg">Activities</Label>
                    <Textarea placeholder="List your activities separated by comma..." className="bg-gray-800/50 border-gray-700/50 text-white" value={form.activities} onChange={e => setForm({ ...form, activities: e.target.value })} />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm">
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* PDF Preview */}
            <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <CardTitle className="text-lg sm:text-xl font-bold text-white">A4 size PDF</CardTitle>
                  <Button
                    className="bg-indigo-500 text-white hover:bg-indigo-600 text-xs sm:text-sm w-full sm:w-auto"
                    onClick={handleDownload}
                    disabled={loading}
                  >
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {loading ? 'Processing...' : 'Download'}
                  </Button>
                </div>
                <p className="text-gray-400 text-xs sm:text-sm">This is A4 size paper. This page might not work for PWA user.</p>
              </CardHeader>
              <CardContent>
                <div className="aspect-[1/1.4] bg-white rounded-lg p-4 sm:p-8 overflow-auto">
                  <div ref={resumeRef} className="max-w-[700px] mx-auto text-gray-900 font-sans">
                    {/* Name and Contact */}
                    <div className="text-center border-b-2 border-gray-300 pb-2 mb-4">
                      <h1 className="text-3xl font-bold tracking-wide uppercase">{form.name || 'Your Name'}</h1>
                      <div className="text-sm mt-2">{form.address || 'Your Address'} {form.phone && <>| {form.phone}</>} {form.email && <>| {form.email}</>}</div>
                    </div>

                    {/* Summary */}
                    {form.summary && (
                      <div className="mb-4">
                        <div className="font-bold text-base mb-1">Professional Summary</div>
                        <div className="text-sm">{form.summary}</div>
                      </div>
                    )}

                    {/* Experience */}
                    <div className="mb-4">
                      <div className="font-bold text-base mb-1 border-b border-gray-300 pb-1">Experience</div>
                      {form.experiences.map((exp, idx) => (
                        <div key={idx} className="mb-2">
                          <div className="font-semibold text-sm">{exp.title} <span className="font-normal">| {exp.company}</span> <span className="italic text-xs">| {exp.location}</span></div>
                          <div className="text-xs text-gray-700 mb-1">{exp.period}</div>
                          <div className="text-xs">{exp.description}</div>
                        </div>
                      ))}
                    </div>

                    {/* Skills */}
                    {form.skills && (
                      <div className="mb-4">
                        <div className="font-bold text-base mb-1 border-b border-gray-300 pb-1">Skills</div>
                        <div className="text-xs flex flex-wrap justify-center items-center gap-2 w-full">
                          {form.skills.split(',')
                            .map(skill => skill.trim())
                            .filter(skill => skill.length > 0)
                            .map((skill, idx) => (
                              <span key={idx} className="bg-gray-200 rounded px-2 py-0.5 text-gray-800">{skill}</span>
                            ))
                          }
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    <div className="mb-4">
                      <div className="font-bold text-base mb-1 border-b border-gray-300 pb-1">Education</div>
                      {form.education.map((edu, idx) => (
                        <div key={idx} className="mb-2">
                          <div className="font-semibold text-sm">{edu.degree} <span className="font-normal">| {edu.school}</span> <span className="italic text-xs">| {edu.location}</span></div>
                          <div className="text-xs text-gray-700 mb-1">{edu.year} {edu.gpa && <>| GPA: {edu.gpa}</>} {edu.honors && <>| {edu.honors}</>}</div>
                        </div>
                      ))}
                    </div>

                    {/* Activities */}
                    {form.activities && (
                      <div className="mb-2">
                        <div className="font-bold text-base mb-1 border-b border-gray-300 pb-1">Activities</div>
                        <div className="text-xs flex flex-wrap gap-2 w-full">
                          {form.activities.split(',')
                            .map(act => act.trim())
                            .filter(act => act.length > 0)
                            .map((act, idx) => (
                              <span key={idx} className="bg-gray-100 rounded px-2 py-0.5 text-gray-800">{act}</span>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Resume;
