
/* CHỨC NĂNG GIẢI MÃ CẢM XÚC - CÔ HƯỜNG */
(() => {
  const root = document.getElementById("emotionTool");
  if (!root || root.dataset.initialized === "true") return;
  root.dataset.initialized = "true";

  const choices = root.querySelectorAll(".emotion-choice");
  const selectedLabel = root.querySelector("#selectedEmotion");
  const level = root.querySelector("#emotionLevel");
  const levelValue = root.querySelector("#levelValue");
  const cause = root.querySelector("#emotionCause");
  const need = root.querySelector("#emotionNeed");
  const note = root.querySelector("#emotionNote");
  const result = root.querySelector("#emotionResult");

  let selectedEmotion = "";

  const escapeHTML = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);

  choices.forEach((button) => {
    button.addEventListener("click", () => {
      selectedEmotion = button.dataset.emotion;

      choices.forEach((item) => {
        const active = item === button;
        item.classList.toggle("selected", active);
        item.setAttribute("aria-pressed", String(active));
      });

      selectedLabel.textContent =
        "Em đã chọn cảm xúc: " + selectedEmotion;
    });
  });

  level.addEventListener("input", () => {
    levelValue.textContent = level.value + "/5";
  });

  function createGuidance(emotion, intensity, selectedNeed) {
    const guidance = {
      "Vui vẻ": "Em hãy dành chút thời gian nhận ra điều đã mang lại niềm vui và trân trọng khoảnh khắc ấy.",
      "Buồn bã": "Em có thể cho phép mình buồn, viết ra điều đang khiến mình nặng lòng hoặc chia sẻ với người em tin tưởng.",
      "Lo lắng": "Em thử chia việc đang lo thành những bước nhỏ, rồi chọn một việc vừa sức để bắt đầu.",
      "Tức giận": "Em có thể tạm dừng cuộc trò chuyện, thở chậm và chờ bình tĩnh hơn trước khi giải quyết vấn đề.",
      "Bối rối": "Em hãy thử viết ra điều mình đã biết, điều chưa rõ và câu hỏi muốn tìm lời giải đáp.",
      "Cô đơn": "Em có thể bắt đầu bằng một lời chào hoặc chia sẻ với một người em cảm thấy an toàn khi trò chuyện.",
      "Thất vọng": "Em hãy nhìn nhận điều chưa như mong đợi và cân nhắc một bước nhỏ có thể làm khác đi.",
      "Bình tĩnh": "Em có thể tận dụng trạng thái này để nghỉ ngơi, suy nghĩ hoặc chuẩn bị cho việc mình muốn làm."
    };

    let advice = guidance[emotion] ||
      "Em hãy dành thời gian nhận biết điều mình đang trải qua và lựa chọn cách chăm sóc bản thân phù hợp.";

    if (intensity >= 4) {
      advice += " Vì cảm xúc đang khá mạnh, em có thể tạm dừng việc gây áp lực, tìm một nơi phù hợp và trò chuyện với người lớn đáng tin cậy nếu cần.";
    }

    if (selectedNeed === "Được lắng nghe") {
      advice += " Em có thể tìm một người em tin tưởng và nói rõ rằng mình mong được lắng nghe, chưa cần nhận lời khuyên ngay.";
    } else if (selectedNeed === "Giải quyết vấn đề") {
      advice += " Hãy xác định vấn đề cụ thể và chọn một hành động nhỏ, an toàn để bắt đầu.";
    } else if (selectedNeed === "Hiểu cảm xúc") {
      advice += " Em thử tự hỏi: chuyện gì đã xảy ra, mình đang nghĩ gì và điều gì quan trọng với mình lúc này?";
    } else if (selectedNeed === "Bình tĩnh hơn") {
      advice += " Em có thể thử hít vào nhẹ nhàng, thở ra chậm hơn trong vài nhịp, không ép bản thân phải bình tĩnh ngay.";
    }

    return advice;
  }

  root.querySelector("#decodeEmotionBtn").addEventListener("click", () => {
    if (!selectedEmotion) {
      selectedLabel.textContent =
        "Em hãy chọn một cảm xúc trước nhé.";
      return;
    }

    const intensity = Number(level.value);
    const selectedCause = cause.value;
    const selectedNeed = need.value;
    const description = note.value.trim();

    const advice = createGuidance(
      selectedEmotion, intensity, selectedNeed
    );

    result.hidden = false;
    result.innerHTML = `
      <h3>💗 Cùng Cô Hường khám phá cảm xúc</h3>
      <p><strong>Cảm xúc em chọn:</strong>
        ${escapeHTML(selectedEmotion)}</p>
      <p><strong>Mức độ:</strong> ${intensity}/5</p>
      <p><strong>Tình huống em chọn:</strong>
        ${escapeHTML(selectedCause || "Chưa xác định")}</p>
      <p><strong>Điều em mong muốn:</strong>
        ${escapeHTML(selectedNeed || "Chưa xác định")}</p>
      <p><strong>Gợi ý dành cho em:</strong> ${escapeHTML(advice)}</p>
      ${description ? `
        <p><strong>Điều em chia sẻ:</strong>
          ${escapeHTML(description)}</p>
        <p>Cảm ơn em đã chia sẻ. Phần ghi chú này được dùng để hiển thị trong phiên hiện tại; chức năng này không tự lưu vào máy chủ.</p>
      ` : ""}
      <p><strong>Em hãy nhớ:</strong> Công cụ này giúp em tự khám phá cảm xúc, không phải công cụ chẩn đoán tâm lý. Nếu cảm xúc kéo dài, ảnh hưởng nhiều đến sinh hoạt hoặc em cảm thấy không an toàn, hãy tìm một người lớn đáng tin cậy hoặc giáo viên tư vấn để được hỗ trợ trực tiếp.</p>
    `;

    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  root.querySelector("#resetEmotionBtn").addEventListener("click", () => {
    selectedEmotion = "";
    choices.forEach((button) => {
      button.classList.remove("selected");
      button.setAttribute("aria-pressed", "false");
    });

    selectedLabel.textContent = "Em chưa chọn cảm xúc.";
    level.value = "3";
    levelValue.textContent = "3/5";
    cause.value = "";
    need.value = "";
    note.value = "";
    result.replaceChildren();
    result.hidden = true;
  });
})();
