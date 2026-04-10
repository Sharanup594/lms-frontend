import { jsPDF } from 'jspdf'

interface CertificateData {
  studentName: string
  courseName: string
  instructorName: string
  completionDate: string
  certificateId: string
}

export function generateCertificate(data: CertificateData) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const w = doc.internal.pageSize.getWidth()
  const h = doc.internal.pageSize.getHeight()

  // ── Background ──
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 0, w, h, 'F')

  // ── Decorative border ──
  doc.setDrawColor(37, 99, 235) // primary-600
  doc.setLineWidth(2)
  doc.rect(10, 10, w - 20, h - 20)
  doc.setLineWidth(0.5)
  doc.rect(14, 14, w - 28, h - 28)

  // ── Corner accents ──
  doc.setFillColor(37, 99, 235)
  // Top-left
  doc.circle(14, 14, 3, 'F')
  // Top-right
  doc.circle(w - 14, 14, 3, 'F')
  // Bottom-left
  doc.circle(14, h - 14, 3, 'F')
  // Bottom-right
  doc.circle(w - 14, h - 14, 3, 'F')

  // ── Logo area ──
  doc.setFillColor(37, 99, 235)
  doc.roundedRect(w / 2 - 15, 22, 30, 14, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('LH', w / 2, 31, { align: 'center' })

  // ── Title ──
  doc.setTextColor(37, 99, 235)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text('LEARNHUB', w / 2, 44, { align: 'center' })

  doc.setTextColor(100, 100, 100)
  doc.setFontSize(11)
  doc.text('CERTIFICATE OF COMPLETION', w / 2, 52, { align: 'center' })

  // ── Decorative line ──
  doc.setDrawColor(37, 99, 235)
  doc.setLineWidth(0.8)
  doc.line(w / 2 - 40, 56, w / 2 + 40, 56)

  // ── "This certifies that" ──
  doc.setTextColor(120, 120, 120)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('This is to certify that', w / 2, 68, { align: 'center' })

  // ── Student name ──
  doc.setTextColor(23, 23, 23)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text(data.studentName, w / 2, 82, { align: 'center' })

  // ── Underline under name ──
  const nameWidth = doc.getTextWidth(data.studentName)
  doc.setDrawColor(37, 99, 235)
  doc.setLineWidth(0.5)
  doc.line(w / 2 - nameWidth / 2, 85, w / 2 + nameWidth / 2, 85)

  // ── "has successfully completed" ──
  doc.setTextColor(120, 120, 120)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text('has successfully completed the course', w / 2, 96, { align: 'center' })

  // ── Course name ──
  doc.setTextColor(37, 99, 235)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(data.courseName, w / 2, 110, { align: 'center' })

  // ── Instructor + Date row ──
  const rowY = 132

  // Left: Instructor
  doc.setDrawColor(180, 180, 180)
  doc.setLineWidth(0.3)
  doc.line(50, rowY, 120, rowY)
  doc.setTextColor(23, 23, 23)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(data.instructorName, 85, rowY - 3, { align: 'center' })
  doc.setTextColor(140, 140, 140)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Course Instructor', 85, rowY + 6, { align: 'center' })

  // Right: Date
  doc.setDrawColor(180, 180, 180)
  doc.line(w - 120, rowY, w - 50, rowY)
  doc.setTextColor(23, 23, 23)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(data.completionDate, w - 85, rowY - 3, { align: 'center' })
  doc.setTextColor(140, 140, 140)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Date of Completion', w - 85, rowY + 6, { align: 'center' })

  // ── Certificate ID ──
  doc.setTextColor(180, 180, 180)
  doc.setFontSize(8)
  doc.text(`Certificate ID: ${data.certificateId}`, w / 2, h - 20, { align: 'center' })

  // ── Bottom accent bar ──
  doc.setFillColor(37, 99, 235)
  doc.rect(w / 2 - 30, h - 16, 60, 2, 'F')

  // ── Download ──
  const filename = `LearnHub-Certificate-${data.courseName.replace(/\s+/g, '-')}.pdf`
  doc.save(filename)
}
