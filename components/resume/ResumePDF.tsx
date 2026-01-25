// components/resume/ResumePDF.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: "Times-Roman",
    color: "#000000",
  },
  // Header
  header: {
    textAlign: "center",
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: "1px solid #000000",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  contactLine: {
    fontSize: 10,
    marginBottom: 3,
  },
  // Section
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
    paddingBottom: 4,
    borderBottom: "1px solid #000000",
    letterSpacing: 1.5,
  },
  sectionContent: {
    marginTop: 6,
  },
  // Summary
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
  },
  // Skills
  skillGroup: {
    marginBottom: 4,
    flexDirection: "row",
  },
  skillCategory: {
    fontWeight: "bold",
    fontSize: 10,
  },
  skillList: {
    fontSize: 10,
  },
  // Experience
  experienceItem: {
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  role: {
    fontSize: 10,
    fontWeight: "bold",
  },
  date: {
    fontSize: 10,
    color: "#505050",
  },
  company: {
    fontSize: 10,
    color: "#505050",
    marginBottom: 3,
  },
  bullet: {
    fontSize: 10,
    color: "#323232",
    marginBottom: 2,
    paddingLeft: 12,
    lineHeight: 1.4,
  },
  bulletText: {
    marginLeft: 8,
  },
  // Projects
  projectItem: {
    marginBottom: 8,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  projectTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  projectLink: {
    fontSize: 10,
    color: "#505050",
  },
  projectDescription: {
    fontSize: 10,
    color: "#323232",
    marginBottom: 3,
    lineHeight: 1.4,
  },
  techStack: {
    flexDirection: "row",
    fontSize: 10,
  },
  techLabel: {
    fontWeight: "bold",
    color: "#505050",
  },
  techList: {
    color: "#505050",
  },
  // Education
  educationItem: {
    marginBottom: 6,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  degree: {
    fontSize: 10,
    fontWeight: "bold",
  },
  year: {
    fontSize: 10,
    color: "#505050",
  },
  school: {
    fontSize: 10,
    color: "#505050",
  },
  // Achievements
  achievementItem: {
    fontSize: 10,
    color: "#323232",
    marginBottom: 2,
    paddingLeft: 12,
    lineHeight: 1.4,
  },
});

interface ResumePDFProps {
  resume: any;
}

export const ResumePDF = ({ resume }: ResumePDFProps) => {
  const {
    personal,
    summary,
    skillGroups,
    experience,
    projects,
    education,
    achievements,
  } = resume;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal.fullName || "Your Name"}</Text>
          
          {/* Contact Line 1 */}
          {(personal.email || personal.phone || personal.location) && (
            <Text style={styles.contactLine}>
              {[personal.email, personal.phone, personal.location]
                .filter(Boolean)
                .join("    ")}
            </Text>
          )}
          
          {/* Contact Line 2 */}
          {(personal.linkedIn || personal.portfolio) && (
            <Text style={styles.contactLine}>
              {[personal.linkedIn, personal.portfolio]
                .filter(Boolean)
                .join("    ")}
            </Text>
          )}
        </View>

        {/* Professional Summary */}
        {summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <View style={styles.sectionContent}>
              <Text style={styles.summaryText}>{summary}</Text>
            </View>
          </View>
        )}

        {/* Skills */}
        {skillGroups && skillGroups.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.sectionContent}>
              {skillGroups.map((group: any) => (
                <View key={group.id} style={styles.skillGroup}>
                  <Text style={styles.skillCategory}>{group.category}: </Text>
                  <Text style={styles.skillList}>
                    {group.skills.map((s: any) => s.name).join(", ")}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            <View style={styles.sectionContent}>
              {experience.map((exp: any) => (
                <View key={exp.id} style={styles.experienceItem}>
                  <View style={styles.experienceHeader}>
                    <Text style={styles.role}>{exp.role}</Text>
                    <Text style={styles.date}>
                      {exp.startDate && `${exp.startDate}`}
                      {exp.startDate && (exp.endDate || exp.currentlyWorking) && " – "}
                      {exp.endDate || (exp.currentlyWorking && "Present")}
                    </Text>
                  </View>
                  <Text style={styles.company}>{exp.company}</Text>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <View>
                      {exp.bullets.map((bullet: any) => (
                        <View key={bullet.id} style={styles.bullet}>
                          <Text>• {bullet.text}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            <View style={styles.sectionContent}>
              {projects.map((project: any) => (
                <View key={project.id} style={styles.projectItem}>
                  <View style={styles.projectHeader}>
                    <Text style={styles.projectTitle}>{project.title}</Text>
                    {project.link && (
                      <Text style={styles.projectLink}>{project.link}</Text>
                    )}
                  </View>
                  {project.description && (
                    <Text style={styles.projectDescription}>
                      {project.description}
                    </Text>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <View style={styles.techStack}>
                      <Text style={styles.techLabel}>Tech: </Text>
                      <Text style={styles.techList}>
                        {project.technologies.join(", ")}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            <View style={styles.sectionContent}>
              {education.map((edu: any) => (
                <View key={edu.id} style={styles.educationItem}>
                  <View style={styles.educationHeader}>
                    <Text style={styles.degree}>{edu.degree}</Text>
                    {edu.graduationYear && (
                      <Text style={styles.year}>{edu.graduationYear}</Text>
                    )}
                  </View>
                  <Text style={styles.school}>
                    {edu.school}
                    {edu.field && ` – ${edu.field}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Awards & Achievements */}
        {achievements && achievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards & Achievements</Text>
            <View style={styles.sectionContent}>
              {achievements.map((achievement: string, index: number) => (
                <View key={index} style={styles.achievementItem}>
                  <Text>• {achievement}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};