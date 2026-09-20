/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Challenge } from "../types";

export const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: "c1",
    titleAr: "7 أيام بدون سكر",
    titleEn: "7 Days No Sugar",
    descriptionAr: "تجنب جميع أنواع السكريات المضافة والحلويات لمدة أسبوع كامل لتحسين صحتك.",
    descriptionEn: "Avoid all added sugars and sweets for a full week to improve your health.",
    durationDays: 7,
    icon: "IceCream",
    color: "bg-pink-500"
  },
  {
    id: "c2",
    titleAr: "تحدي شرب الماء (3 لتر)",
    titleEn: "Water Challenge (3L)",
    descriptionAr: "التزم بشرب 3 لترات من الماء يومياً لمدة 10 أيام لترطيب جسمك وزيادة نشاطك.",
    descriptionEn: "Commit to drinking 3 liters of water daily for 10 days to hydrate and boost energy.",
    durationDays: 10,
    icon: "Droplets",
    color: "bg-blue-500"
  },
  {
    id: "c3",
    titleAr: "30 دقيقة مشي يومياً",
    titleEn: "30 Mins Daily Walk",
    descriptionAr: "امشِ لمدة 30 دقيقة على الأقل يومياً لمدة 14 يوماً لتحسين لياقتك البدنية.",
    descriptionEn: "Walk for at least 30 minutes daily for 14 days to improve your physical fitness.",
    durationDays: 14,
    icon: "Footprints",
    color: "bg-green-500"
  },
  {
    id: "c4",
    titleAr: "تحدي الخضروات الورقية",
    titleEn: "Leafy Greens Challenge",
    descriptionAr: "أضف حصة من الخضروات الورقية لكل وجبة غداء وعشاء لمدة 7 أيام.",
    descriptionEn: "Add a serving of leafy greens to every lunch and dinner for 7 days.",
    durationDays: 7,
    icon: "Leaf",
    color: "bg-emerald-500"
  }
];
