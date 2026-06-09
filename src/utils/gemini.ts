/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from '@google/genai';
import { Task } from '../types';
import { getTodayDateString } from './dummyData';

// Khởi tạo Client GenAI bằng API Key từ Vite env
// Cần truyền API Key rõ ràng do đây là biến client-side custom
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

/**
 * PB-F1: Xử lý ngôn ngữ tự nhiên để tự động tạo Task (AI Auto-Triage)
 */
export async function parseNaturalLanguageTask(inputText: string): Promise<Partial<Task>> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Phân tích câu lệnh của người dùng và chuyển đổi thành thông tin task.
Đầu vào: "${inputText}"
Hạn ngày (due_date) mặc định luôn là ngày hôm nay (${getTodayDateString()}) nếu không có yêu cầu đặc biệt.
Hãy thiết lập một khung giờ bắt đầu hợp lý (scheduled_at) nếu người dùng có nhắc đến (nhớ tự chuyển đổi giờ như "5h chiều" thành 17:00).
Nếu không nhắc thời lượng, hãy ước lượng một số nguyên phút phù hợp với tính chất việc.`,
      config: {
        responseMimeType: 'application/json',
        // Định nghĩa Schema chặt chẽ
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { 
              type: Type.STRING, 
              description: 'Tên ngắn gọn của công việc, viết hoa chữ cái đầu' 
            },
            description: { 
              type: Type.STRING, 
              description: 'Mô tả chi tiết bổ sung (nếu có)' 
            },
            category: { 
              type: Type.STRING, 
              enum: ['Làm việc', 'Học tập', 'Admin'],
              description: 'Phân loại công việc' 
            },
            eisenhower_q: { 
              type: Type.STRING, 
              enum: ['Q1', 'Q2', 'Q3', 'Q4'],
              description: 'Ma trận Eisenhower ưu tiên'
            },
            energy_level: { 
              type: Type.STRING, 
              enum: ['HIGH', 'MEDIUM', 'LOW'],
              description: 'Mức năng lượng cần thiết'
            },
            estimated_min: { 
              type: Type.INTEGER, 
              description: 'Thời lượng (phút)' 
            },
            scheduled_at: { 
              type: Type.STRING, 
              description: 'Giờ bắt đầu dạng HH:MM (có thể null nếu không nhắc)'
            },
            due_date: { 
              type: Type.STRING, 
              description: 'Hạn ngày định dạng YYYY-MM-DD'
            }
          },
          required: ['title', 'category', 'eisenhower_q', 'energy_level', 'estimated_min', 'due_date'],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Partial<Task>;
    }
    throw new Error('AI không phản hồi văn bản');
  } catch (error) {
    console.error('Lỗi khi phân tích bằng Gemini:', error);
    throw error;
  }
}
