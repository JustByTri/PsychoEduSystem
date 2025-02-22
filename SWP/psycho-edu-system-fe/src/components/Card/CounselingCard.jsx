import React from 'react';

const CounselingCard = () => {
  return (
    <div className="bg-[#98E9D3] rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Counseling Center</h2>
      <div className="space-y-2">
        <p>Address: Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí Minh 700000</p>
        <p>Phone: <a href="tel:02873005588" className="underline">028 7300 5588</a></p>
      </div>
    </div>
  );
};

export default CounselingCard;