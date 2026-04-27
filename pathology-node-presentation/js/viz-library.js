/* ============================================================
   Lecture Visualization Library — D3.js visualizations
   Each function takes a container DOM element and optional config
   ============================================================ */

const VizLibrary = (function () {

    // ─── WORKFLOW PIPELINE (three-phase) ─────────────────────
    function workflowPipeline(container, config) {
        var W = 1050, H = 340;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var phases = (config && config.phases) || [
            { label: 'Pre-Analytical', color: '#3498db',
              steps: ['Order', 'Collection', 'Labeling', 'Accessioning'] },
            { label: 'Analytical', color: '#27ae60',
              steps: ['Grossing', 'Processing', 'Slide Creation', 'Staining'] },
            { label: 'Post-Analytical', color: '#9b59b6',
              steps: ['Interpretation', 'Reporting', 'Distribution', 'Follow-up'] }
        ];

        var phaseW = 330, gap = 24, stepH = 36, stepGap = 8;
        var stepW = phaseW - 30;

        phases.forEach(function (phase, pi) {
            var px = pi * (phaseW + gap) + 12;
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', px).attr('y', 0)
                .attr('width', phaseW).attr('height', H - 10)
                .attr('rx', 12).attr('fill', phase.color).attr('fill-opacity', 0.08)
                .attr('stroke', phase.color).attr('stroke-opacity', 0.3).attr('stroke-width', 1.5);

            g.append('text').attr('x', px + phaseW / 2).attr('y', 30)
                .attr('text-anchor', 'middle').attr('font-size', '15px')
                .attr('font-weight', '700').attr('fill', phase.color)
                .text(phase.label);

            phase.steps.forEach(function (step, si) {
                var sx = px + 15;
                var sy = 50 + si * (stepH + stepGap);

                g.append('rect').attr('x', sx).attr('y', sy)
                    .attr('width', stepW).attr('height', stepH)
                    .attr('rx', 8).attr('fill', 'white')
                    .attr('stroke', phase.color).attr('stroke-width', 1.5);

                g.append('text').attr('x', sx + stepW / 2).attr('y', sy + stepH / 2 + 5)
                    .attr('text-anchor', 'middle').attr('font-size', '13px')
                    .attr('fill', '#0e6e8c').text(step);

                if (si < phase.steps.length - 1) {
                    var ay = sy + stepH + 2;
                    g.append('path')
                        .attr('d', 'M' + (sx + stepW / 2 - 5) + ',' + ay +
                              ' L' + (sx + stepW / 2) + ',' + (ay + stepGap - 2) +
                              ' L' + (sx + stepW / 2 + 5) + ',' + ay)
                        .attr('fill', phase.color).attr('opacity', 0.5);
                }
            });

            g.transition().delay(pi * 400).duration(600).style('opacity', 1);
        });

        for (var i = 0; i < 2; i++) {
            var ax = (i + 1) * (phaseW + gap) - gap / 2 + 12;
            svg.append('text').attr('x', ax).attr('y', H / 2)
                .attr('text-anchor', 'middle').attr('font-size', '24px')
                .attr('fill', '#bdc3c7').text('\u2192')
                .style('opacity', 0)
                .transition().delay(800 + i * 300).duration(400).style('opacity', 1);
        }
    }

    // ─── ABSTRACTION LAYERS (car analogy) ────────────────────
    function abstractionLayers(container, config) {
        var W = 1000, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var layerH = 56, gap = 10, colW = 420;
        var topStart = 44;                          // y where layer boxes begin
        var topEnd = topStart + 2 * layerH + gap;   // bottom of 2nd layer box
        var annotY = topEnd + 26;                    // "FOCUS HERE" text baseline
        var botStart = annotY + 18;                  // top of 3rd layer box

        var carLayers = [
            { label: 'Driver', sub: 'Where you want to go, how fast', color: '#2980b9' },
            { label: 'Controls', sub: 'Steering, pedals, dashboard', color: '#3498db' },
            { label: 'Drivetrain', sub: 'Engine, transmission, electronics', color: '#5dade2' },
            { label: 'Components', sub: 'Chips, sensors, fuel injectors', color: '#85c1e9' }
        ];
        var pathLayers = [
            { label: 'Pathologist', sub: 'Diagnosis, workflow decisions', color: '#27ae60' },
            { label: 'Workflow & Logic', sub: 'Rules, validations, distribution', color: '#2ecc71' },
            { label: 'Systems', sub: 'LIS, viewers, interfaces, middleware', color: '#58d68d' },
            { label: 'Infrastructure', sub: 'Servers, CPUs, networks, storage', color: '#82e0aa' }
        ];

        // Focus bracket — covers the top two layers
        var bracketTop = topStart - 8;
        var bracketH = topEnd - bracketTop + 8;
        svg.append('rect').attr('x', 0).attr('y', bracketTop)
            .attr('width', W).attr('height', bracketH)
            .attr('rx', 14).attr('fill', 'rgba(41,128,185,0.06)')
            .attr('stroke', '#2980b9').attr('stroke-dasharray', '6,4')
            .attr('stroke-width', 1.5);

        // Annotation line + text between top and bottom layers
        svg.append('line')
            .attr('x1', 40).attr('x2', W - 40)
            .attr('y1', annotY - 10).attr('y2', annotY - 10)
            .attr('stroke', '#2980b9').attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,3').attr('opacity', 0.5);

        svg.append('text').attr('x', W / 2).attr('y', annotY + 4)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#2980b9').attr('font-weight', '600')
            .text('\u25B2 FOCUS HERE \u2014 the abstraction layers that matter for clinical practice');

        function drawCol(layers, xOff, title, emoji) {
            var g = svg.append('g');
            g.append('text').attr('x', xOff + colW / 2).attr('y', 28)
                .attr('text-anchor', 'middle').attr('font-size', '15px')
                .attr('font-weight', '700').attr('fill', '#0e6e8c')
                .text(emoji + '  ' + title);

            layers.forEach(function (layer, i) {
                // Top 2 layers above annotation, bottom 2 below
                var y = i < 2
                    ? topStart + i * (layerH + gap)
                    : botStart + (i - 2) * (layerH + gap);

                var lg = g.append('g').style('opacity', 0);

                lg.append('rect').attr('x', xOff).attr('y', y)
                    .attr('width', colW).attr('height', layerH)
                    .attr('rx', 10).attr('fill', layer.color).attr('fill-opacity', 0.15)
                    .attr('stroke', layer.color).attr('stroke-width', 2);

                lg.append('text').attr('x', xOff + 18).attr('y', y + 24)
                    .attr('font-size', '15px').attr('font-weight', '700')
                    .attr('fill', layer.color).text(layer.label);

                lg.append('text').attr('x', xOff + 18).attr('y', y + 43)
                    .attr('font-size', '12px').attr('fill', '#555').text(layer.sub);

                var targetOpacity = i < 2 ? 1.0 : 0.35;
                lg.transition().delay(i * 250 + 200).duration(500).style('opacity', targetOpacity);
            });
        }

        drawCol(carLayers, 20, 'Driving a Car', '\uD83D\uDE97');
        drawCol(pathLayers, W - colW - 20, 'Practicing Pathology', '\uD83D\uDD2C');

        // Equivalence symbol between columns (vertically centered on top layers)
        var eqY = topStart + layerH + gap / 2;
        svg.append('text').attr('x', W / 2).attr('y', eqY + 6)
            .attr('text-anchor', 'middle').attr('font-size', '30px')
            .attr('fill', '#bdc3c7').text('\u2248');
    }

    // ─── SYSTEMS ECOSYSTEM ───────────────────────────────────
    function systemsEcosystem(container, config) {
        var W = 950, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var nodes = [
            { id: 'LIS', label: 'LIS', r: 44, color: '#2980b9' },
            { id: 'scanners', label: 'Instrument\nInterfaces', r: 30, color: '#27ae60' },
            { id: 'imaging', label: 'Image Mgmt\n/ Viewer', r: 30, color: '#8e44ad' },
            { id: 'dictation', label: 'Dictation &\nReporting', r: 30, color: '#e67e22' },
            { id: 'middleware', label: 'Middleware', r: 28, color: '#16a085' },
            { id: 'portals', label: 'Portals /\nDashboards', r: 28, color: '#2c3e50' },
            { id: 'warehouse', label: 'Data\nWarehouse', r: 30, color: '#c0392b' },
            { id: 'messaging', label: 'Messaging /\nNotifications', r: 28, color: '#f39c12' },
            { id: 'ai', label: 'AI / ML\nModels', r: 28, color: '#e74c3c' }
        ];

        var links = [
            { source: 'LIS', target: 'scanners' },
            { source: 'LIS', target: 'imaging' },
            { source: 'LIS', target: 'dictation' },
            { source: 'LIS', target: 'middleware' },
            { source: 'LIS', target: 'portals' },
            { source: 'LIS', target: 'warehouse' },
            { source: 'LIS', target: 'messaging' },
            { source: 'LIS', target: 'ai' },
            { source: 'imaging', target: 'ai' },
            { source: 'warehouse', target: 'ai' },
            { source: 'middleware', target: 'scanners' }
        ];

        var cx = W / 2, cy = H / 2, radius = 170;
        nodes[0].x = cx; nodes[0].y = cy;
        var outer = nodes.slice(1);
        outer.forEach(function (n, i) {
            var angle = (i / outer.length) * 2 * Math.PI - Math.PI / 2;
            n.x = cx + radius * Math.cos(angle);
            n.y = cy + radius * Math.sin(angle);
        });

        var nodeMap = {};
        nodes.forEach(function (n) { nodeMap[n.id] = n; });

        svg.selectAll('.eco-link')
            .data(links).enter()
            .append('line')
            .attr('x1', function (d) { return nodeMap[d.source].x; })
            .attr('y1', function (d) { return nodeMap[d.source].y; })
            .attr('x2', function (d) { return nodeMap[d.target].x; })
            .attr('y2', function (d) { return nodeMap[d.target].y; })
            .attr('stroke', '#bdc3c7').attr('stroke-width', 2)
            .style('opacity', 0)
            .transition().delay(function (d, i) { return 300 + i * 80; }).duration(400)
            .style('opacity', 0.4);

        var nodeGs = svg.selectAll('.eco-node')
            .data(nodes).enter()
            .append('g')
            .attr('transform', function (d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .style('opacity', 0);

        nodeGs.append('circle')
            .attr('r', function (d) { return d.r; })
            .attr('fill', function (d) { return d.color; }).attr('fill-opacity', 0.15)
            .attr('stroke', function (d) { return d.color; }).attr('stroke-width', 2.5);

        nodeGs.each(function (d) {
            var lines = d.label.split('\n');
            var g = d3.select(this);
            lines.forEach(function (line, i) {
                g.append('text')
                    .attr('y', (i - (lines.length - 1) / 2) * 13 + 4)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', d.id === 'LIS' ? '16px' : '10px')
                    .attr('font-weight', d.id === 'LIS' ? '800' : '600')
                    .attr('fill', d.color)
                    .text(line);
            });
        });

        nodeGs.transition().delay(function (d, i) { return i * 150; }).duration(500)
            .style('opacity', 1);
    }

    // ─── AI MATURITY LADDER ──────────────────────────────────
    function aiMaturityLadder(container, config) {
        var W = 950, H = 360;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var levels = [
            { label: 'Level IV: Integrated Decision Support', sub: 'Differential generation, risk stratification', color: '#8e44ad', icon: '\uD83E\uDDE0' },
            { label: 'Level III: Assistive AI', sub: 'Flagging, quantification, draft reports', color: '#e74c3c', icon: '\uD83E\uDD16' },
            { label: 'Level II: Real-time QA & Safety', sub: 'Mismatch detection, missing fields, hard stops', color: '#f39c12', icon: '\uD83D\uDEE1\uFE0F' },
            { label: 'Level I: Retrospective Analytics', sub: 'TAT reports, volumes, trends', color: '#27ae60', icon: '\uD83D\uDCCA' }
        ];

        var stepH = 68, baseW = 860, narrowing = 100;

        levels.forEach(function (level, i) {
            var w = baseW - i * narrowing;
            var x = (W - w) / 2;
            var y = H - (levels.length - i) * (stepH + 6);

            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 10).attr('fill', level.color).attr('fill-opacity', 0.12)
                .attr('stroke', level.color).attr('stroke-width', 2);

            g.append('text').attr('x', x + 44).attr('y', y + 30)
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('fill', level.color).text(level.label);

            g.append('text').attr('x', x + 44).attr('y', y + 50)
                .attr('font-size', '11px').attr('fill', '#555').text(level.sub);

            g.append('text').attr('x', x + 18).attr('y', y + 40)
                .attr('font-size', '20px').text(level.icon);

            g.transition().delay((levels.length - 1 - i) * 350).duration(500).style('opacity', 1);
        });
    }

    // ─── DATA FLOW PIPELINE ──────────────────────────────────
    function dataFlow(container, config) {
        var W = 1000, H = 160;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var steps = ['Capture', 'Map', 'Store', 'Clean', 'Present', 'Interpret', 'Act'];
        var colors = ['#3498db', '#2980b9', '#1abc9c', '#27ae60', '#f39c12', '#e67e22', '#e74c3c'];
        var stepW = 110, gapX = 18;
        var startX = (W - steps.length * (stepW + gapX) + gapX) / 2;

        steps.forEach(function (step, i) {
            var x = startX + i * (stepW + gapX);
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', 30)
                .attr('width', stepW).attr('height', 50)
                .attr('rx', 10).attr('fill', colors[i]).attr('fill-opacity', 0.15)
                .attr('stroke', colors[i]).attr('stroke-width', 2);

            g.append('text').attr('x', x + stepW / 2).attr('y', 60)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('font-weight', '600').attr('fill', colors[i]).text(step);

            if (i < steps.length - 1) {
                g.append('text').attr('x', x + stepW + gapX / 2).attr('y', 60)
                    .attr('text-anchor', 'middle').attr('font-size', '18px')
                    .attr('fill', '#bdc3c7').text('\u2192');
            }

            if (i > 0 && i < steps.length - 1) {
                g.append('text').attr('x', x - gapX / 2).attr('y', 105)
                    .attr('text-anchor', 'middle').attr('font-size', '9px')
                    .attr('fill', '#e74c3c').attr('font-weight', '600').text('\u26A0 interface');
            }

            g.transition().delay(i * 180).duration(400).style('opacity', 1);
        });

        svg.append('text').attr('x', W / 2).attr('y', 140)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#e74c3c').attr('font-style', 'italic')
            .text('Failures cluster at interfaces, not in isolated steps');
    }

    // ─── AUTOMATION MATURITY LADDER ──────────────────────────
    function automationLadder(container, config) {
        var W = 900, H = 260;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var levels = [
            { label: 'Level III: Guidance', sub: 'Dynamic worklists, exception triage, "falling behind" detection', color: '#8e44ad' },
            { label: 'Level II: Prevention', sub: 'Constraints + safety checks (prevent known harms)', color: '#f39c12' },
            { label: 'Level I: Tracking', sub: 'Audit events (what happened, when)', color: '#27ae60' }
        ];

        var stepH = 58, baseW = 800, narrowing = 120;

        levels.forEach(function (level, i) {
            var w = baseW - i * narrowing;
            var x = (W - w) / 2;
            var y = H - (levels.length - i) * (stepH + 8);

            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 10).attr('fill', level.color).attr('fill-opacity', 0.12)
                .attr('stroke', level.color).attr('stroke-width', 2);

            g.append('text').attr('x', x + 18).attr('y', y + 25)
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('fill', level.color).text(level.label);

            g.append('text').attr('x', x + 18).attr('y', y + 45)
                .attr('font-size', '11px').attr('fill', '#555').text(level.sub);

            g.transition().delay((levels.length - 1 - i) * 350).duration(500).style('opacity', 1);
        });
    }

    // ─── PHASE COMPARISON (CP ✓ vs AP ?) ─────────────────────
    function phaseComparison(container, config) {
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var colW = 500, gap = 60;
        var phaseW = 150, phaseH = 260, phaseGap = 10;
        var colors = ['#3498db', '#27ae60', '#9b59b6'];
        var phaseLabels = ['Pre-Analytical', 'Analytical', 'Post-Analytical'];

        // ── LEFT: Clinical Chemistry (clean) ──
        var lx = 0;
        var lg = svg.append('g').style('opacity', 0);
        lg.append('text').attr('x', lx + colW / 2).attr('y', 24)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', '700').attr('fill', '#0e6e8c')
            .text('Clinical Chemistry  ✓');

        var cpSteps = [
            ['Order entry', 'Collection', 'Transport', 'Accessioning'],
            ['Instrument analysis', '(single automated step)'],
            ['Result review', 'Reporting', 'Distribution']
        ];

        phaseLabels.forEach(function (label, pi) {
            var px = lx + pi * (phaseW + phaseGap) + 20;
            lg.append('rect').attr('x', px).attr('y', 40)
                .attr('width', phaseW).attr('height', phaseH)
                .attr('rx', 10).attr('fill', colors[pi]).attr('fill-opacity', 0.08)
                .attr('stroke', colors[pi]).attr('stroke-opacity', 0.4).attr('stroke-width', 1.5);

            lg.append('text').attr('x', px + phaseW / 2).attr('y', 62)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('font-weight', '700').attr('fill', colors[pi]).text(label);

            cpSteps[pi].forEach(function (step, si) {
                lg.append('text').attr('x', px + phaseW / 2).attr('y', 88 + si * 22)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', '#555').text(step);
            });
        });

        // Clean dividers between phases
        for (var di = 0; di < 2; di++) {
            var dx = lx + (di + 1) * (phaseW + phaseGap) + 20 - phaseGap / 2;
            lg.append('text').attr('x', dx).attr('y', 170)
                .attr('text-anchor', 'middle').attr('font-size', '18px')
                .attr('fill', '#bdc3c7').text('→');
        }

        lg.append('text').attr('x', lx + colW / 2).attr('y', H - 30)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#27ae60').attr('font-weight', '600')
            .text('Clean boundaries — each step belongs to exactly one phase');

        lg.transition().duration(600).style('opacity', 1);

        // ── RIGHT: Anatomic Pathology (blurred) ──
        var rx = colW + gap;
        var rg = svg.append('g').style('opacity', 0);
        rg.append('text').attr('x', rx + colW / 2).attr('y', 24)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', '700').attr('fill', '#0e6e8c')
            .text('Anatomic Pathology  ?');

        var apSteps = [
            ['Order entry', 'Collection', 'Transport'],
            ['Grossing ←→', 'Processing', 'Slide creation', 'Staining', 'Interpretation', 'Sign-out'],
            ['Reporting', 'Distribution', 'Recuts / rescans ←→', 'Follow-up']
        ];

        phaseLabels.forEach(function (label, pi) {
            var px = rx + pi * (phaseW + phaseGap) + 20;
            var h = pi === 1 ? phaseH + 20 : phaseH - 10;
            var y = pi === 1 ? 30 : 50;

            rg.append('rect').attr('x', px).attr('y', y)
                .attr('width', phaseW).attr('height', h)
                .attr('rx', 10).attr('fill', colors[pi]).attr('fill-opacity', 0.08)
                .attr('stroke', colors[pi]).attr('stroke-opacity', 0.4).attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '6,3');

            rg.append('text').attr('x', px + phaseW / 2).attr('y', y + 22)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('font-weight', '700').attr('fill', colors[pi]).text(label);

            apSteps[pi].forEach(function (step, si) {
                var isOverlap = (step.indexOf('←→') >= 0);
                rg.append('text').attr('x', px + phaseW / 2).attr('y', y + 46 + si * 22)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', isOverlap ? '#e74c3c' : '#555')
                    .attr('font-weight', isOverlap ? '700' : '400')
                    .text(step);
            });
        });

        // Full-width BLUR overlay spanning all three AP phases
        var blurX = rx + 14;
        var blurW = 3 * phaseW + 2 * phaseGap + 12;
        rg.append('rect').attr('x', blurX).attr('y', 70)
            .attr('width', blurW).attr('height', 200).attr('rx', 10)
            .attr('fill', '#e74c3c').attr('fill-opacity', 0.04)
            .attr('stroke', '#e74c3c').attr('stroke-dasharray', '6,4')
            .attr('stroke-width', 1.5).attr('stroke-opacity', 0.5);
        rg.append('text').attr('x', blurX + blurW / 2).attr('y', 286)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#e74c3c').attr('font-weight', '700')
            .text('BOUNDARIES BLUR — activities cross phases');

        rg.append('text').attr('x', rx + colW / 2).attr('y', H - 30)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#e74c3c').attr('font-weight', '600')
            .text('Grossing, staining, recuts, rescans — all straddle phases');

        rg.transition().delay(500).duration(600).style('opacity', 1);

        // Center divider
        svg.append('line').attr('x1', colW + gap / 2).attr('x2', colW + gap / 2)
            .attr('y1', 10).attr('y2', H - 10)
            .attr('stroke', '#e0e5eb').attr('stroke-width', 1).attr('stroke-dasharray', '4,4');
    }

    // ─── CASE TIMELINE (duration-proportional Gantt with breakpoints + magnifier) ──
    function caseTimeline(container, config) {
        var steps = (config && config.steps) || [];
        var W = 1280, H = 660;
        var margin = { top: 110, right: 70, bottom: 140, left: 70 };
        var plotW = W - margin.left - margin.right;
        var plotH = 110;
        var barY = margin.top + 80;

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('width', '100%').style('max-height', '80vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");

        // Background
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#0f172a');

        // Title
        svg.append('text')
            .attr('x', W / 2).attr('y', 24)
            .attr('text-anchor', 'middle')
            .attr('font-size', '24px').attr('font-weight', '700').attr('fill', '#e2e8f0')
            .text('Anatomy of a Case — Where the Model Breaks');
        svg.append('text')
            .attr('x', W / 2).attr('y', 48)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('fill', '#94a3b8').attr('font-style', 'italic')
            .text('Bar width = elapsed minutes. Red markers show the exact handoffs where the model breaks.');
        // Magnifier hint
        svg.append('text')
            .attr('x', W / 2).attr('y', 70)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('fill', '#60a5fa')
            .text('🔍  Hover any step to examine it under the magnifying glass');

        // Compute cumulative time — breakpoints with minutes=0 count as instantaneous events
        var totalMinutes = d3.sum(steps, function(s) { return s.minutes || 0; });
        var cumulative = 0;
        var laid = steps.map(function(s) {
            var start = cumulative;
            cumulative += (s.minutes || 0);
            return { step: s, start: start, end: cumulative, duration: s.minutes || 0 };
        });

        var xScale = d3.scaleLinear().domain([0, totalMinutes]).range([0, plotW]);

        // Phase grouping (visual bands)
        var phases = [
            { name: 'Pre-analytic', range: [0, 5], color: '#3b82f6' },
            { name: 'Analytic', range: [5, 9], color: '#22c55e' },
            { name: 'Breakpoint → Rework', range: [9, 11], color: '#ef4444' },
            { name: 'Post-analytic', range: [11, 13], color: '#8b5cf6' }
        ];

        // Phase band backdrop above the bar
        phases.forEach(function(ph) {
            var startMin = laid[ph.range[0]] ? laid[ph.range[0]].start : 0;
            var endIdx = Math.min(ph.range[1] - 1, laid.length - 1);
            var endMin = laid[endIdx] ? laid[endIdx].end : totalMinutes;
            var x0 = margin.left + xScale(startMin);
            var x1 = margin.left + xScale(endMin);
            svg.append('rect')
                .attr('x', x0).attr('y', barY - 22)
                .attr('width', Math.max(0, x1 - x0)).attr('height', 14)
                .attr('fill', ph.color).attr('fill-opacity', 0.18)
                .attr('rx', 2);
            svg.append('text')
                .attr('x', (x0 + x1) / 2).attr('y', barY - 11)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10px').attr('font-weight', '700')
                .attr('fill', ph.color)
                .attr('letter-spacing', '1px')
                .text(ph.name.toUpperCase());
        });

        // Minimum visible width for tiny steps (breakpoints with 0 min)
        var minVisibleW = 6;

        // Precompute bar geometry for later (hover group reuses positions)
        var barGeom = laid.map(function(d, i) {
            var isDelay = !!d.step.delay;
            var rawW = xScale(d.duration);
            var w = Math.max(rawW, isDelay ? 12 : minVisibleW);
            var x = margin.left + xScale(d.start);
            var phColor = '#64748b';
            phases.forEach(function(ph) {
                if (i >= ph.range[0] && i < ph.range[1]) phColor = ph.color;
            });
            return { x: x, w: w, isDelay: isDelay, phColor: phColor, d: d, i: i };
        });

        // Draw each step as a bar
        barGeom.forEach(function(b) {
            var d = b.d, i = b.i, w = b.w, x = b.x;
            var fill = b.isDelay ? '#ef4444' : b.phColor;
            var fillOpacity = b.isDelay ? 0.85 : 0.6;

            var g = svg.append('g').style('opacity', 0).style('cursor', 'zoom-in');

            g.append('rect')
                .attr('x', x).attr('y', barY)
                .attr('width', w).attr('height', plotH)
                .attr('fill', fill).attr('fill-opacity', fillOpacity)
                .attr('stroke', b.isDelay ? '#fca5a5' : b.phColor)
                .attr('stroke-width', b.isDelay ? 2 : 1)
                .attr('rx', 3);

            // Step label (rotated if narrow)
            var labelX = x + w / 2;
            var useRotation = w < 60;
            var label = g.append('text')
                .attr('fill', '#f1f5f9').attr('font-size', '12px').attr('font-weight', '600')
                .attr('text-anchor', 'middle')
                .style('pointer-events', 'none');
            if (useRotation) {
                label.attr('transform', 'translate(' + labelX + ',' + (barY + plotH / 2) + ') rotate(-90)')
                    .text(d.step.label);
            } else {
                label.attr('x', labelX).attr('y', barY + plotH / 2 - 2)
                    .text(d.step.label);
            }

            // Duration below label (if visible)
            if (!useRotation && d.duration > 0) {
                var timeStr = d.duration >= 60
                    ? Math.round(d.duration / 60 * 10) / 10 + ' h'
                    : d.duration + ' m';
                g.append('text')
                    .attr('x', labelX).attr('y', barY + plotH / 2 + 16)
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#e2e8f0').attr('font-size', '11px').attr('opacity', 0.75)
                    .style('pointer-events', 'none')
                    .text(timeStr);
            }

            // Hover hooks
            g.on('mouseenter', function() { showMagnifier(b); })
             .on('mouseleave', function() { hideMagnifier(); });

            g.transition().delay(i * 80).duration(400).style('opacity', 1);
        });

        // Breakpoint callouts — first goes above, second goes below (deterministic, non-colliding)
        var delayIdx = 0;
        laid.forEach(function(d, i) {
            if (!d.step.delay || !d.step.delayNote) return;
            var b = barGeom[i];
            var x = b.x + b.w / 2;
            var isTop = (delayIdx === 0);
            delayIdx++;
            var calloutY = isTop ? (barY - 52) : (barY + plotH + 32);
            var lineY1 = isTop ? barY : barY + plotH;
            var lineY2 = isTop ? calloutY + 22 : calloutY - 4;

            // Leader line
            svg.append('line')
                .attr('x1', x).attr('y1', lineY1)
                .attr('x2', x).attr('y2', lineY2)
                .attr('stroke', '#ef4444').attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '4,3');

            // Marker dot at the bar edge
            svg.append('circle')
                .attr('cx', x).attr('cy', lineY1)
                .attr('r', 6).attr('fill', '#ef4444')
                .attr('stroke', '#0f172a').attr('stroke-width', 2);

            // Warning badge background
            var noteText = '⚠ ' + d.step.delayNote;
            var estW = noteText.length * 6.8 + 24;
            // Keep badge within plot area
            var badgeX = Math.max(margin.left, Math.min(margin.left + plotW - estW, x - estW / 2));
            svg.append('rect')
                .attr('x', badgeX).attr('y', calloutY)
                .attr('width', estW).attr('height', 26)
                .attr('rx', 5)
                .attr('fill', '#7f1d1d').attr('fill-opacity', 0.7)
                .attr('stroke', '#ef4444').attr('stroke-width', 1.2);

            svg.append('text')
                .attr('x', badgeX + estW / 2).attr('y', calloutY + 17)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px').attr('font-weight', '700')
                .attr('fill', '#fecaca')
                .text(noteText);
        });

        // Time axis at the bottom
        var axisY = barY + plotH + 64;
        var ticksMinutes = [0, 60, 240, 480, 720, 960, totalMinutes];
        svg.append('line')
            .attr('x1', margin.left).attr('x2', margin.left + plotW)
            .attr('y1', axisY).attr('y2', axisY)
            .attr('stroke', '#475569').attr('stroke-width', 1);
        ticksMinutes.forEach(function(t) {
            var tx = margin.left + xScale(t);
            svg.append('line')
                .attr('x1', tx).attr('x2', tx)
                .attr('y1', axisY).attr('y2', axisY + 5)
                .attr('stroke', '#64748b').attr('stroke-width', 1);
            var label = t === 0 ? 'start' : (t / 60).toFixed(t < 120 ? 0 : 1) + ' h';
            svg.append('text')
                .attr('x', tx).attr('y', axisY + 18)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10px').attr('fill', '#94a3b8')
                .text(label);
        });

        // Total elapsed annotation
        var totalLabel = (totalMinutes / 60).toFixed(1) + ' h total elapsed — should have been ~' +
            (((totalMinutes - 90 - 300) / 60)).toFixed(1) + ' h';
        svg.append('text')
            .attr('x', margin.left + plotW).attr('y', axisY + 38)
            .attr('text-anchor', 'end')
            .attr('font-size', '11px').attr('fill', '#fca5a5').attr('font-weight', '600')
            .text(totalLabel);

        // Bottom takeaway
        svg.append('text')
            .attr('x', W / 2).attr('y', H - 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('fill', '#e2e8f0').attr('font-style', 'italic')
            .text('Each red marker is a specific handoff. The fix depends entirely on which one.');

        // ─── MAGNIFIER LENS TOOLTIP ─────────────────────────────
        // SVG filter for drop shadow + defs for lens
        var defs = svg.append('defs');
        var filter = defs.append('filter')
            .attr('id', 'magGlow').attr('x', '-30%').attr('y', '-30%')
            .attr('width', '160%').attr('height', '160%');
        filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
        var merge = filter.append('feMerge');
        merge.append('feMergeNode').attr('in', 'blur');
        merge.append('feMergeNode').attr('in', 'SourceGraphic');

        var magLayer = svg.append('g').attr('class', 'magnifier').style('pointer-events', 'none');

        function hideMagnifier() {
            magLayer.interrupt();
            magLayer.selectAll('*').remove();
        }

        function showMagnifier(b) {
            hideMagnifier();
            var d = b.d;
            var centerX = b.x + b.w / 2;
            // Clamp horizontally
            var lensR = 150;
            var cx = Math.max(lensR + 10, Math.min(W - lensR - 10, centerX));
            // Place lens above the bar, or below if no room
            var placeAbove = (barY - 60) > (lensR * 2 + 40);
            var cy = placeAbove ? (barY - lensR - 18) : (barY + plotH + lensR + 28);
            if (cy + lensR > H - 50) cy = H - 50 - lensR;

            // Connector from lens rim to the bar (the magnifier "handle")
            var targetY = placeAbove ? barY : (barY + plotH);
            var dx = centerX - cx, dy = targetY - cy;
            var len = Math.sqrt(dx * dx + dy * dy) || 1;
            var rimX = cx + (dx / len) * lensR;
            var rimY = cy + (dy / len) * lensR;

            // Dim backdrop over the whole viz except the lens
            var mask = defs.append('mask').attr('id', 'lensMask-' + b.i);
            mask.append('rect').attr('width', W).attr('height', H).attr('fill', 'white');
            mask.append('circle').attr('cx', cx).attr('cy', cy).attr('r', lensR).attr('fill', 'black');

            magLayer.append('rect')
                .attr('width', W).attr('height', H)
                .attr('fill', '#0f172a').attr('fill-opacity', 0)
                .attr('mask', 'url(#lensMask-' + b.i + ')')
                .transition().duration(200).attr('fill-opacity', 0.55);

            // Handle (stick from lens to bar)
            magLayer.append('line')
                .attr('x1', rimX).attr('y1', rimY)
                .attr('x2', centerX).attr('y2', targetY)
                .attr('stroke', '#475569').attr('stroke-width', 6).attr('stroke-linecap', 'round')
                .attr('opacity', 0)
                .transition().duration(200).attr('opacity', 0.85);

            // Outer lens ring (bezel)
            magLayer.append('circle')
                .attr('cx', cx).attr('cy', cy).attr('r', lensR + 6)
                .attr('fill', 'none').attr('stroke', '#334155').attr('stroke-width', 8)
                .attr('opacity', 0)
                .transition().duration(200).attr('opacity', 1);

            // Lens glass
            var lensGroup = magLayer.append('g').style('opacity', 0);
            lensGroup.append('circle')
                .attr('cx', cx).attr('cy', cy).attr('r', lensR)
                .attr('fill', '#f8fafc')
                .attr('stroke', '#94a3b8').attr('stroke-width', 2);

            // Subtle glass highlight
            lensGroup.append('ellipse')
                .attr('cx', cx - 55).attr('cy', cy - 65)
                .attr('rx', 55).attr('ry', 22)
                .attr('fill', '#ffffff').attr('fill-opacity', 0.6);

            // Clip for lens content
            var clipId = 'lensClip-' + b.i;
            defs.append('clipPath').attr('id', clipId)
                .append('circle').attr('cx', cx).attr('cy', cy).attr('r', lensR - 6);

            var content = lensGroup.append('g').attr('clip-path', 'url(#' + clipId + ')');

            // Color accent stripe
            var accent = b.isDelay ? '#ef4444' : b.phColor;
            content.append('rect')
                .attr('x', cx - lensR).attr('y', cy - lensR)
                .attr('width', lensR * 2).attr('height', 6)
                .attr('fill', accent);

            // Step label (large)
            content.append('text')
                .attr('x', cx).attr('y', cy - 70)
                .attr('text-anchor', 'middle')
                .attr('font-size', '26px').attr('font-weight', '800')
                .attr('fill', '#0f172a')
                .text(d.step.label);

            // Duration badge
            var durStr = d.duration === 0
                ? 'instantaneous event'
                : (d.duration >= 60
                    ? Math.round(d.duration / 60 * 10) / 10 + ' hours (' + d.duration + ' min)'
                    : d.duration + ' minutes');
            content.append('text')
                .attr('x', cx).attr('y', cy - 44)
                .attr('text-anchor', 'middle')
                .attr('font-size', '13px').attr('font-weight', '600')
                .attr('fill', accent)
                .attr('letter-spacing', '1px')
                .text(durStr.toUpperCase());

            // Delay badge (if applicable)
            if (b.isDelay && d.step.delayNote) {
                content.append('rect')
                    .attr('x', cx - 130).attr('y', cy - 30)
                    .attr('width', 260).attr('height', 22)
                    .attr('rx', 4)
                    .attr('fill', '#fef2f2').attr('stroke', '#ef4444');
                content.append('text')
                    .attr('x', cx).attr('y', cy - 14)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '12px').attr('font-weight', '700')
                    .attr('fill', '#991b1b')
                    .text('⚠ ' + d.step.delayNote);
            }

            // Detail text — wrap to fit lens
            var detail = d.step.detail || '';
            var words = detail.split(/\s+/);
            var maxWidth = 34; // characters per line approx
            var lines = [];
            var cur = '';
            words.forEach(function(wd) {
                if ((cur + ' ' + wd).trim().length > maxWidth) {
                    if (cur) lines.push(cur.trim());
                    cur = wd;
                } else {
                    cur = (cur + ' ' + wd).trim();
                }
            });
            if (cur) lines.push(cur);
            lines = lines.slice(0, 5);

            var startY = cy + (b.isDelay && d.step.delayNote ? 14 : 0);
            lines.forEach(function(ln, li) {
                content.append('text')
                    .attr('x', cx).attr('y', startY + li * 18)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '13px')
                    .attr('fill', '#1e293b')
                    .text(ln);
            });

            // Step index marker at bottom of lens
            content.append('text')
                .attr('x', cx).attr('y', cy + lensR - 18)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10px').attr('font-weight', '700')
                .attr('fill', '#94a3b8')
                .attr('letter-spacing', '2px')
                .text('STEP ' + (b.i + 1) + ' OF ' + laid.length);

            lensGroup.transition().duration(200).style('opacity', 1);
        }
    }

    // ─── MEASUREMENT INTERVALS (relay race + error types) ────
    function measurementIntervals(container, config) {
        var steps = (config && config.steps) || [];
        var errorTypes = (config && config.errorTypes) || [];
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // ── Top row: step chain as relay race with split times ──
        var n = steps.length;
        var boxW = 76, boxH = 30, gapX = 12;
        var totalW = n * boxW + (n - 1) * gapX;
        var startX = (W - totalW) / 2;
        var chainY = 30;

        steps.forEach(function (step, i) {
            var x = startX + i * (boxW + gapX);
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', chainY)
                .attr('width', boxW).attr('height', boxH)
                .attr('rx', 5).attr('fill', 'rgba(14,110,140,0.08)')
                .attr('stroke', '#0e6e8c').attr('stroke-width', 1.5);

            g.append('text').attr('x', x + boxW / 2).attr('y', chainY + boxH / 2 + 4)
                .attr('text-anchor', 'middle').attr('font-size', '8px')
                .attr('font-weight', '600').attr('fill', '#0e6e8c')
                .text(step);

            // Interval bracket below
            if (i < n - 1) {
                var midX = x + boxW + gapX / 2;
                g.append('text').attr('x', midX).attr('y', chainY + boxH / 2 + 4)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', '#bdc3c7').text('→');

                // Small clock icon for measurable interval
                g.append('text').attr('x', midX).attr('y', chainY + boxH + 16)
                    .attr('text-anchor', 'middle').attr('font-size', '8px')
                    .attr('fill', '#999').text('⏱');
            }

            g.transition().delay(i * 60).duration(300).style('opacity', 1);
        });

        // ── Bottom section: error type cards ──
        var cardY = chainY + boxH + 50;
        var cardW = (W - 80) / errorTypes.length;
        var cardGap = 20;

        errorTypes.forEach(function (et, ei) {
            var cx = 20 + ei * (cardW + cardGap);
            var g = svg.append('g').style('opacity', 0);

            g.append('rect').attr('x', cx).attr('y', cardY)
                .attr('width', cardW).attr('height', H - cardY - 20)
                .attr('rx', 10).attr('fill', et.color).attr('fill-opacity', 0.06)
                .attr('stroke', et.color).attr('stroke-opacity', 0.3).attr('stroke-width', 1.5);

            g.append('text').attr('x', cx + 14).attr('y', cardY + 26)
                .attr('font-size', '14px').attr('font-weight', '700').attr('fill', et.color)
                .text(et.icon + '  ' + et.label);

            et.items.forEach(function (item, ii) {
                g.append('text').attr('x', cx + 22).attr('y', cardY + 52 + ii * 24)
                    .attr('font-size', '12px').attr('fill', '#444')
                    .text('• ' + item);
            });

            g.transition().delay(400 + ei * 300).duration(500).style('opacity', 1);
        });

        // Connecting lines from chain to error type cards
        var lineY1 = chainY + boxH + 20;
        var lineY2 = cardY - 5;
        errorTypes.forEach(function (et, ei) {
            var cx = 20 + ei * (cardW + cardGap) + cardW / 2;
            svg.append('line').attr('x1', cx).attr('y1', lineY1)
                .attr('x2', cx).attr('y2', lineY2)
                .attr('stroke', et.color).attr('stroke-width', 1)
                .attr('stroke-dasharray', '4,3').attr('opacity', 0.4);
        });
    }

    // ─── SHARED: TOOLTIP HELPER ────────────────────────────────
    function _createTooltip(parentContainer) {
        var tip = document.createElement('div');
        tip.className = 'viz-tooltip';
        tip.style.cssText = 'position:absolute;pointer-events:none;opacity:0;transition:opacity 0.15s;' +
            'background:rgba(15,23,42,0.95);color:#e2e8f0;padding:10px 14px;border-radius:10px;' +
            'font-size:13px;line-height:1.45;max-width:260px;box-shadow:0 8px 24px rgba(0,0,0,0.3);' +
            'border:1px solid rgba(71,85,105,0.4);backdrop-filter:blur(8px);z-index:30;' +
            'font-family:Inter,Helvetica Neue,Arial,sans-serif;';
        parentContainer.style.position = 'relative';
        parentContainer.appendChild(tip);
        return tip;
    }
    function _showTooltip(tip, html, x, y) {
        tip.innerHTML = html;
        tip.style.left = x + 'px';
        tip.style.top = y + 'px';
        tip.style.opacity = '1';
    }
    function _hideTooltip(tip) { tip.style.opacity = '0'; }

    // ─── ANIMATED PIPELINE (packets flowing through stations) ─
    function animatedPipeline(container, config) {
        var W = 1060, H = 340;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Glow filter
        var defs = svg.append('defs');
        var filter = defs.append('filter').attr('id', 'pkt-glow');
        filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
        var mg = filter.append('feMerge');
        mg.append('feMergeNode').attr('in', 'blur');
        mg.append('feMergeNode').attr('in', 'SourceGraphic');

        // Grid background
        var gridP = defs.append('pattern')
            .attr('id', 'pipe-grid').attr('width', 40).attr('height', 40)
            .attr('patternUnits', 'userSpaceOnUse');
        gridP.append('path').attr('d', 'M 40 0 L 0 0 0 40')
            .attr('fill', 'none').attr('stroke', '#1e293b').attr('stroke-width', 0.8);

        svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#0f172a').attr('rx', 12);
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', 'url(#pipe-grid)');

        var stations = (config && config.stations) || [
            { id: 'gap', label: 'Workflow Gap', sub: 'Identify problem', x: 80, y: 140, w: 110, h: 56, color: '#ef4444' },
            { id: 'spec', label: 'Functional Spec', sub: 'Define requirements', x: 260, y: 140, w: 130, h: 56, color: '#f97316' },
            { id: 'build', label: 'Build / Code', sub: 'Develop solution', x: 460, y: 140, w: 110, h: 56, color: '#22c55e' },
            { id: 'test', label: 'Validate', sub: 'Clinical testing', x: 640, y: 140, w: 100, h: 56, color: '#3b82f6' },
            { id: 'deploy', label: 'Deploy', sub: 'Ship to users', x: 810, y: 140, w: 90, h: 56, color: '#8b5cf6' },
            { id: 'feedback', label: 'Feedback', sub: 'Measure & iterate', x: 960, y: 140, w: 90, h: 56, color: '#06b6d4' }
        ];

        // Draw tracks
        for (var ti = 0; ti < stations.length - 1; ti++) {
            var s1 = stations[ti], s2 = stations[ti + 1];
            svg.append('path').attr('id', 'track-' + ti)
                .attr('d', 'M' + (s1.x + s1.w) + ',' + (s1.y + s1.h / 2) +
                    ' C' + (s1.x + s1.w + 40) + ',' + (s1.y + s1.h / 2) +
                    ' ' + (s2.x - 40) + ',' + (s2.y + s2.h / 2) +
                    ' ' + s2.x + ',' + (s2.y + s2.h / 2))
                .attr('fill', 'none').attr('stroke', '#334155')
                .attr('stroke-width', 4).attr('stroke-linecap', 'round');
        }

        // Feedback loop
        var fst = stations[0], lst = stations[stations.length - 1];
        svg.append('path')
            .attr('d', 'M' + (lst.x + lst.w / 2) + ',' + lst.y +
                ' C' + (lst.x + lst.w / 2) + ',50' +
                ' ' + (fst.x + fst.w / 2) + ',50' +
                ' ' + (fst.x + fst.w / 2) + ',' + fst.y)
            .attr('fill', 'none').attr('stroke', '#f59e0b')
            .attr('stroke-width', 2).attr('stroke-dasharray', '8,5').attr('opacity', 0.5);

        svg.append('text').attr('x', W / 2).attr('y', 40)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#f59e0b').attr('font-weight', '600')
            .text('Feedback Loop \u2014 iterate based on real usage');

        // Draw stations
        stations.forEach(function (st, i) {
            var g = svg.append('g').style('opacity', 0);
            g.append('rect').attr('x', st.x).attr('y', st.y)
                .attr('width', st.w).attr('height', st.h).attr('rx', 10)
                .attr('fill', '#1e293b').attr('stroke', st.color).attr('stroke-width', 2);
            g.append('text').attr('x', st.x + st.w / 2).attr('y', st.y + 26)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('font-weight', '700').attr('fill', '#f8fafc').text(st.label);
            g.append('text').attr('x', st.x + st.w / 2).attr('y', st.y + 44)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#94a3b8').text(st.sub);
            g.append('circle').attr('cx', st.x - 10).attr('cy', st.y + st.h / 2)
                .attr('r', 5).attr('fill', st.color)
                .style('filter', 'drop-shadow(0 0 6px ' + st.color + ')');
            g.transition().delay(i * 200).duration(400).style('opacity', 1);
        });

        // Timeline annotation below
        var roles = [
            { text: 'Domain Expert (You)', x: 170, color: '#ef4444' },
            { text: 'Developer + Clinician', x: 530, color: '#22c55e' },
            { text: 'Production', x: 900, color: '#8b5cf6' }
        ];
        roles.forEach(function (r) {
            svg.append('text').attr('x', r.x).attr('y', H - 40)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('fill', r.color).attr('font-weight', '600').text(r.text);
        });

        // Spawn animated packets
        function spawnPacket() {
            var types = [
                { label: 'FS Alert', color: '#ef4444' },
                { label: 'NGS Rpt', color: '#22c55e' },
                { label: 'QA Tool', color: '#3b82f6' },
                { label: 'Dash', color: '#f59e0b' }
            ];
            var pt = types[Math.floor(Math.random() * types.length)];
            var pkt = svg.append('g').attr('filter', 'url(#pkt-glow)');
            pkt.append('rect').attr('x', -18).attr('y', -9)
                .attr('width', 36).attr('height', 18).attr('rx', 4).attr('fill', pt.color);
            pkt.append('text').attr('y', 1).attr('text-anchor', 'middle')
                .attr('font-size', '7px').attr('font-weight', '700')
                .attr('fill', '#fff').attr('dominant-baseline', 'middle').text(pt.label);

            var idx = 0;
            function step() {
                var path = svg.select('#track-' + idx).node();
                if (!path) { pkt.transition().duration(300).style('opacity', 0).remove(); return; }
                var len = path.getTotalLength();
                var p0 = path.getPointAtLength(0);
                pkt.attr('transform', 'translate(' + p0.x + ',' + p0.y + ')');
                pkt.transition().duration(1100 + Math.random() * 400).ease(d3.easeLinear)
                    .attrTween('transform', function () {
                        return function (t) {
                            var p = path.getPointAtLength(t * len);
                            return 'translate(' + p.x + ',' + p.y + ')';
                        };
                    })
                    .on('end', function () {
                        idx++;
                        if (idx < stations.length - 1) setTimeout(step, 150 + Math.random() * 250);
                        else pkt.transition().duration(400).style('opacity', 0).remove();
                    });
            }
            step();
        }

        var sc = 0;
        function sched() {
            if (sc++ >= 12) return;
            spawnPacket();
            setTimeout(sched, 2200 + Math.random() * 1400);
        }
        setTimeout(sched, 1200);
    }

    // ─── SEVEN OPTIONS LADDER ─────────────────────────────────
    function sevenOptionsLadder(container, config) {
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var tip = _createTooltip(container);

        var options = [
            { label: '1. Ignore the gap', sub: 'Live with it — accept the friction', color: '#8b0000', bg: '#fce4e4', icon: '🙈', zone: 'passive', tip: '<strong>Risk:</strong> Friction compounds. Every workaround is a future error. Staff burnout increases, and the gap never closes.' },
            { label: '2. Patch manually', sub: 'Workarounds, spreadsheets, sticky notes', color: '#a0522d', bg: '#faebd7', icon: '🩹', zone: 'passive', tip: '<strong>Reality:</strong> 80% of labs do this. Spreadsheets become critical infrastructure that no one maintains. One person leaves, the workaround dies.' },
            { label: '3. Switch LIS vendor', sub: 'Nuclear option — massive cost, 2-3 year project', color: '#6b4c3b', bg: '#f5ebe0', icon: '💣', zone: 'passive', tip: '<strong>Cost:</strong> $5–15M+ for a large lab. 2–3 year implementation. And the new LIS will have its own gaps.' },
            { label: '4. Request vendor fix', sub: 'Submit ticket, wait 12-18 months, hope', color: '#b8860b', bg: '#fef9e7', icon: '📋', zone: 'dependent', tip: '<strong>Challenge:</strong> Your request competes with hundreds of others. Even if approved, the vendor\u2019s generic solution may not match your specific workflow.' },
            { label: '5. Outsource development', sub: 'Hire contractors — works if spec is clear', color: '#d35400', bg: '#fdf2e9', icon: '🤝', zone: 'active', tip: '<strong>Key:</strong> Requires a clear functional specification. Without domain expertise on the contractor side, expect multiple revision cycles.' },
            { label: '6. Build it yourself', sub: 'In-house team with domain expertise', color: '#1e8449', bg: '#eafaf1', icon: '🔧', zone: 'active', tip: '<strong>Advantage:</strong> Fastest iteration, deepest domain fit. Gershkovich & Sinard showed cost-effectiveness over 4–5 years. Yale has done this for 15+ years.' },
            { label: '7. Integrate open-source', sub: 'QuPath, DSA, Slideflow — customize & deploy', color: '#1a5276', bg: '#e8f0f8', icon: '🧩', zone: 'active', tip: '<strong>Best of both:</strong> Start from production-quality code, customize for your needs. Growing ecosystem with community support.' }
        ];

        var stepH = 44, baseW = 900, narrowing = 55;

        // Zone bracket on left
        svg.append('line').attr('x1', 25).attr('x2', 25)
            .attr('y1', 14).attr('y2', H - 10)
            .attr('stroke', '#ccc').attr('stroke-width', 2.5);

        // Passive zone label
        svg.append('text').attr('x', 16).attr('y', 90)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', '#8b0000')
            .attr('transform', 'rotate(-90, 16, 90)')
            .text('PASSIVE');

        // Active zone label
        svg.append('text').attr('x', 16).attr('y', H - 50)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', '#1e8449')
            .attr('transform', 'rotate(-90, 16, ' + (H - 50) + ')')
            .text('ACTIVE');

        options.forEach(function (opt, i) {
            var w = baseW - (options.length - 1 - i) * narrowing;
            var x = 40 + (baseW - w) / 2;
            var y = 12 + i * (stepH + 4);

            var g = svg.append('g').style('opacity', 0);

            var rect = g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 8).attr('fill', opt.bg)
                .attr('stroke', opt.color).attr('stroke-width', 2.5)
                .style('cursor', 'pointer')
                .style('transition', 'all 0.18s ease');

            g.append('text').attr('x', x + 40).attr('y', y + 20)
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('fill', opt.color).text(opt.label)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 40).attr('y', y + 36)
                .attr('font-size', '11.5px').attr('fill', '#333').text(opt.sub)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 14).attr('y', y + 30)
                .attr('font-size', '18px').text(opt.icon)
                .style('pointer-events', 'none');

            // Hover tooltip + highlight
            if (opt.tip) {
                (function (optRef, rectRef, xPos, yPos, width) {
                    rectRef.on('mouseenter', function () {
                        rectRef.attr('stroke-width', 4);
                        d3.select(this.parentNode).style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))');
                        _showTooltip(tip, optRef.tip, xPos + width + 16, yPos - 8);
                    }).on('mouseleave', function () {
                        rectRef.attr('stroke-width', 2.5);
                        d3.select(this.parentNode).style('filter', 'none');
                        _hideTooltip(tip);
                    });
                })(opt, rect, x, y, w);
            }

            g.transition().delay(i * 200).duration(400).style('opacity', 1);
        });

        // Arrow on right side
        svg.append('text').attr('x', W - 26).attr('y', H / 2 + 5)
            .attr('text-anchor', 'middle').attr('font-size', '32px')
            .attr('fill', '#1e8449').text('▲')
            .style('opacity', 0)
            .transition().delay(1600).duration(500).style('opacity', 0.8);

        svg.append('text').attr('x', W - 26).attr('y', H / 2 + 25)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#1e8449').attr('font-weight', '700')
            .text('IMPACT')
            .style('opacity', 0)
            .transition().delay(1600).duration(500).style('opacity', 0.8);
    }

    // ─── COST COMPARISON (vendor vs custom over time) ────────
    function costComparison(container, config) {
        var W = 1060, H = 340;
        var margin = { top: 36, right: 120, bottom: 44, left: 80 };
        var chartW = W - margin.left - margin.right;
        var chartH = H - margin.top - margin.bottom;

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var vendorInit = (config && config.vendorInitial) || 200;
        var vendorPct = (config && config.vendorAnnualPct) || 0.23;
        var customInit = (config && config.customInitial) || 350;
        var customPct = (config && config.customAnnualPct) || 0.05;
        var years = (config && config.years) || 10;

        // Generate data
        var vendorData = [], customData = [];
        var vendorCum = vendorInit, customCum = customInit;
        vendorData.push({ year: 0, cost: vendorInit });
        customData.push({ year: 0, cost: customInit });

        for (var yr = 1; yr <= years; yr++) {
            vendorCum += vendorInit * vendorPct;
            customCum += customInit * customPct;
            vendorData.push({ year: yr, cost: vendorCum });
            customData.push({ year: yr, cost: customCum });
        }

        var maxCost = Math.max(vendorData[years].cost, customData[years].cost);

        var xScale = d3.scaleLinear().domain([0, years]).range([0, chartW]);
        var yScale = d3.scaleLinear().domain([0, maxCost * 1.1]).range([chartH, 0]);

        // Axes
        var xAxis = d3.axisBottom(xScale).ticks(years).tickFormat(function (d) { return 'Yr ' + d; });
        var yAxis = d3.axisLeft(yScale).ticks(6).tickFormat(function (d) { return '$' + d + 'K'; });

        g.append('g').attr('transform', 'translate(0,' + chartH + ')')
            .call(xAxis)
            .selectAll('text').attr('font-size', '12px').attr('fill', '#333').attr('font-weight', '500');

        g.append('g').call(yAxis)
            .selectAll('text').attr('font-size', '12px').attr('fill', '#333').attr('font-weight', '500');

        // Grid lines
        g.selectAll('.grid-line')
            .data(yScale.ticks(6)).enter()
            .append('line')
            .attr('x1', 0).attr('x2', chartW)
            .attr('y1', function (d) { return yScale(d); })
            .attr('y2', function (d) { return yScale(d); })
            .attr('stroke', '#ccc').attr('stroke-width', 1);

        // Vendor line
        var vendorLine = d3.line()
            .x(function (d) { return xScale(d.year); })
            .y(function (d) { return yScale(d.cost); });

        var customLine = d3.line()
            .x(function (d) { return xScale(d.year); })
            .y(function (d) { return yScale(d.cost); });

        // Find crossover point
        var crossYear = -1;
        for (var ci = 1; ci <= years; ci++) {
            if (vendorData[ci].cost >= customData[ci].cost && vendorData[ci - 1].cost < customData[ci - 1].cost) {
                crossYear = ci;
                break;
            }
        }
        // If vendor starts lower
        if (vendorData[0].cost < customData[0].cost) {
            for (var ci2 = 1; ci2 <= years; ci2++) {
                if (vendorData[ci2].cost >= customData[ci2].cost) {
                    crossYear = ci2;
                    break;
                }
            }
        }

        // Breakeven annotation
        if (crossYear > 0) {
            var bx = xScale(crossYear);
            var by = yScale(vendorData[crossYear].cost);
            g.append('line').attr('x1', bx).attr('x2', bx)
                .attr('y1', 0).attr('y2', chartH)
                .attr('stroke', '#e74c3c').attr('stroke-width', 1.5)
                .attr('stroke-dasharray', '6,4').attr('opacity', 0.6);

            g.append('text').attr('x', bx + 8).attr('y', 16)
                .attr('font-size', '11px').attr('fill', '#e74c3c')
                .attr('font-weight', '700')
                .text('Breakeven ~Year ' + crossYear);
        }

        // Shade the savings area after breakeven
        if (crossYear > 0) {
            var areaData = [];
            for (var ai = crossYear; ai <= years; ai++) {
                areaData.push({
                    year: ai,
                    vendorCost: vendorData[ai].cost,
                    customCost: customData[ai].cost
                });
            }
            var area = d3.area()
                .x(function (d) { return xScale(d.year); })
                .y0(function (d) { return yScale(d.customCost); })
                .y1(function (d) { return yScale(d.vendorCost); });

            g.append('path').datum(areaData)
                .attr('d', area)
                .attr('fill', '#27ae60').attr('fill-opacity', 0.2)
                .style('opacity', 0)
                .transition().delay(2000).duration(600).style('opacity', 1);

            // Savings label
            var savingsYear = years;
            var savings = vendorData[savingsYear].cost - customData[savingsYear].cost;
            g.append('text')
                .attr('x', xScale((crossYear + years) / 2))
                .attr('y', yScale((vendorData[savingsYear].cost + customData[savingsYear].cost) / 2) + 5)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('fill', '#27ae60').attr('font-weight', '700')
                .text('$' + Math.round(savings) + 'K saved')
                .style('opacity', 0)
                .transition().delay(2400).duration(500).style('opacity', 1);
        }

        // Draw vendor line with animation
        var vendorPath = g.append('path').datum(vendorData)
            .attr('d', vendorLine)
            .attr('fill', 'none').attr('stroke', '#e74c3c')
            .attr('stroke-width', 3);
        var vendorLen = vendorPath.node().getTotalLength();
        vendorPath.attr('stroke-dasharray', vendorLen)
            .attr('stroke-dashoffset', vendorLen)
            .transition().duration(1500).attr('stroke-dashoffset', 0);

        // Draw custom line with animation
        var customPath = g.append('path').datum(customData)
            .attr('d', customLine)
            .attr('fill', 'none').attr('stroke', '#27ae60')
            .attr('stroke-width', 3);
        var customLen = customPath.node().getTotalLength();
        customPath.attr('stroke-dasharray', customLen)
            .attr('stroke-dashoffset', customLen)
            .transition().duration(1500).attr('stroke-dashoffset', 0);

        // Interactive data point dots with hover
        var costTip = _createTooltip(container);

        vendorData.forEach(function (d) {
            g.append('circle')
                .attr('cx', xScale(d.year)).attr('cy', yScale(d.cost))
                .attr('r', 5).attr('fill', '#e74c3c').attr('stroke', '#fff').attr('stroke-width', 1.5)
                .style('cursor', 'pointer').style('opacity', 0)
                .transition().delay(1500 + d.year * 100).duration(300).style('opacity', 1);
        });
        customData.forEach(function (d) {
            g.append('circle')
                .attr('cx', xScale(d.year)).attr('cy', yScale(d.cost))
                .attr('r', 5).attr('fill', '#27ae60').attr('stroke', '#fff').attr('stroke-width', 1.5)
                .style('cursor', 'pointer').style('opacity', 0)
                .transition().delay(1500 + d.year * 100).duration(300).style('opacity', 1);
        });

        // Overlay transparent rect for mouse tracking
        g.append('rect').attr('width', chartW).attr('height', chartH)
            .attr('fill', 'transparent').style('cursor', 'crosshair')
            .on('mousemove', function (event) {
                var coords = d3.pointer(event);
                var yr = Math.round(xScale.invert(coords[0]));
                if (yr >= 0 && yr <= years) {
                    var vCost = vendorData[yr].cost;
                    var cCost = customData[yr].cost;
                    var diff = vCost - cCost;
                    var diffLabel = diff >= 0
                        ? '<span style="color:#27ae60">Custom saves $' + Math.round(Math.abs(diff)) + 'K</span>'
                        : '<span style="color:#e74c3c">Custom costs $' + Math.round(Math.abs(diff)) + 'K more</span>';
                    _showTooltip(costTip,
                        '<strong>Year ' + yr + '</strong><br>' +
                        '<span style="color:#e74c3c">Vendor: $' + Math.round(vCost) + 'K</span><br>' +
                        '<span style="color:#27ae60">Custom: $' + Math.round(cCost) + 'K</span><br>' +
                        diffLabel,
                        coords[0] + margin.left + 14, coords[1] + margin.top - 20);
                }
            })
            .on('mouseleave', function () { _hideTooltip(costTip); });

        // Legend
        var legend = svg.append('g')
            .attr('transform', 'translate(' + (W - 110) + ',' + (margin.top + 20) + ')');

        legend.append('line').attr('x1', 0).attr('x2', 24).attr('y1', 0).attr('y2', 0)
            .attr('stroke', '#e74c3c').attr('stroke-width', 3);
        legend.append('text').attr('x', 30).attr('y', 4)
            .attr('font-size', '12px').attr('fill', '#e74c3c').text('Vendor');

        legend.append('line').attr('x1', 0).attr('x2', 24).attr('y1', 22).attr('y2', 22)
            .attr('stroke', '#27ae60').attr('stroke-width', 3);
        legend.append('text').attr('x', 30).attr('y', 26)
            .attr('font-size', '12px').attr('fill', '#27ae60').text('Custom');

        // Axis labels
        svg.append('text')
            .attr('x', margin.left + chartW / 2).attr('y', H - 6)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#333').attr('font-weight', '600').text('Years after initial investment');

        svg.append('text')
            .attr('x', 16).attr('y', margin.top + chartH / 2)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#333').attr('font-weight', '600')
            .attr('transform', 'rotate(-90, 16, ' + (margin.top + chartH / 2) + ')')
            .text('Cumulative Cost ($K)');
    }

    // ─── TECH STACK PYRAMID ──────────────────────────────────
    function techStackPyramid(container, config) {
        var W = 1060, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var tip = _createTooltip(container);

        var layers = [
            { label: 'Clinical Requirements & Specifications', sub: 'What does the tool need to do? (YOU write this)', color: '#c0392b', bg: '#fdecea', role: '← Pathologist-driven', icon: '🩺', tip: '<strong>Your most impactful contribution.</strong> Define what the tool must do, who uses it, and what "correct" looks like. No code required.' },
            { label: 'User Interface (UI)', sub: 'HTML, CSS, React — what users see and interact with', color: '#d35400', bg: '#fdf2e9', role: '← Design + clinical input', icon: '🖥️', tip: '<strong>Where usability lives.</strong> Pathologists shape the interface — button placement, workflow order, what information appears where.' },
            { label: 'Application Logic', sub: 'Python, JavaScript, Java — business rules, algorithms', color: '#b7950b', bg: '#fef9e7', role: '← Developer + domain expert', icon: '⚙️', tip: '<strong>The engine.</strong> Business rules translated to code. Domain expert reviews ensure the logic matches clinical reality.' },
            { label: 'APIs & Integration', sub: 'REST, HL7 FHIR, DICOM — connecting systems', color: '#1e8449', bg: '#eafaf1', role: '← Developer', icon: '🔗', tip: '<strong>System glue.</strong> Connects your tool to the LIS, image servers, and external databases.' },
            { label: 'Data & Storage', sub: 'PostgreSQL, MongoDB — where data lives', color: '#1a5276', bg: '#e8f0f8', role: '← Developer + DBA', icon: '🗄️', tip: '<strong>Foundation.</strong> How data is structured, stored, and retrieved. Gets the schema right or nothing else works.' },
            { label: 'Infrastructure', sub: 'Servers, Docker, Cloud, Networks — the plumbing', color: '#6c3483', bg: '#f4ecf7', role: '← IT / DevOps', icon: '🏗️', tip: '<strong>The plumbing.</strong> Servers, containers, networking. Usually handled by IT, not pathologists.' }
        ];

        var stepH = 50, baseW = 920, narrowing = 70;

        // "You are here" bracket around top 2 layers
        var bracketTop = 6;
        var bracketH = 2 * stepH + 18;
        svg.append('rect').attr('x', 28).attr('y', bracketTop)
            .attr('width', W - 56).attr('height', bracketH)
            .attr('rx', 12).attr('fill', 'rgba(192,57,43,0.06)')
            .attr('stroke', '#c0392b').attr('stroke-dasharray', '6,4')
            .attr('stroke-width', 2.5);

        svg.append('text').attr('x', W - 46).attr('y', bracketTop + bracketH / 2 + 5)
            .attr('text-anchor', 'end').attr('font-size', '13px')
            .attr('fill', '#c0392b').attr('font-weight', '700')
            .text('▲ YOUR HIGHEST IMPACT ZONE');

        layers.forEach(function (layer, i) {
            var w = baseW - i * narrowing;
            var x = (W - w) / 2;
            var y = 14 + i * (stepH + 5);

            var g = svg.append('g').style('opacity', 0);

            var rect = g.append('rect').attr('x', x).attr('y', y)
                .attr('width', w).attr('height', stepH)
                .attr('rx', 8).attr('fill', layer.bg)
                .attr('stroke', layer.color).attr('stroke-width', 2.5)
                .style('cursor', 'pointer')
                .style('transition', 'all 0.18s ease');

            g.append('text').attr('x', x + 42).attr('y', y + 22)
                .attr('font-size', '15px').attr('font-weight', '700')
                .attr('fill', layer.color).text(layer.label)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 42).attr('y', y + 40)
                .attr('font-size', '12px').attr('fill', '#333').text(layer.sub)
                .style('pointer-events', 'none');

            g.append('text').attr('x', x + 14).attr('y', y + 32)
                .attr('font-size', '18px').text(layer.icon)
                .style('pointer-events', 'none');

            // Role annotation on right
            g.append('text').attr('x', x + w + 14).attr('y', y + 32)
                .attr('font-size', '12px').attr('fill', layer.color)
                .attr('font-weight', '700').text(layer.role)
                .style('pointer-events', 'none');

            // Hover tooltip + highlight
            (function (layerRef, rectRef, xPos, yPos, width) {
                rectRef.on('mouseenter', function () {
                    rectRef.attr('stroke-width', 4);
                    d3.select(this.parentNode).style('filter', 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))');
                    _showTooltip(tip, layerRef.tip, xPos + width / 2, yPos - 12);
                }).on('mouseleave', function () {
                    rectRef.attr('stroke-width', 2.5);
                    d3.select(this.parentNode).style('filter', 'none');
                    _hideTooltip(tip);
                });
            })(layer, rect, x, y, w);

            // All layers fully visible — no fading lower layers
            g.transition().delay(i * 250).duration(450).style('opacity', 1);
        });
    }

    // ─── DEV LIFECYCLE LOOP ──────────────────────────────────
    function devLifecycleLoop(container, config) {
        // Bauhaus-leaning redesign: hard geometric forms, hairline strokes,
        // signature color blocks, hover-only popups. Form follows function.
        // Wheel scaled +20%; security caption moved under the diagram.
        var W = 1280, H = 720;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");

        var cx = W / 2, cy = 360, radius = 180;

        // popupR override pushes the four diagonal popups (Specify, Design,
        // Deploy, Feedback) out past the dashed security ring so their nearest
        // corner clears the envelope.
        var steps = [
            { label: 'Identify Gap', sub: 'Observe workflow friction', color: '#c0392b', bg: '#fdecea', icon: '🔍' },
            { label: 'Specify',      sub: 'Write functional spec',     color: '#d35400', bg: '#fdf2e9', icon: '📋', popupR: 365 },
            { label: 'Design',       sub: 'Architecture & UX',         color: '#b7950b', bg: '#fef9e7', icon: '✏️', popupR: 370 },
            { label: 'Build',        sub: 'Code & integrate',          color: '#1e8449', bg: '#eafaf1', icon: '🔧' },
            { label: 'Test',         sub: 'Validate clinically',       color: '#1a5276', bg: '#e8f0f8', icon: '🧪' },
            { label: 'Deploy',       sub: 'Ship to production',        color: '#6c3483', bg: '#f4ecf7', icon: '🚀', popupR: 370 },
            { label: 'Feedback',     sub: 'Measure & iterate',         color: '#0e6e5c', bg: '#e8f8f5', icon: '📊', popupR: 365 }
        ];
        var n = steps.length;
        var nodeR = 53;                // 44 * 1.2
        var defaultPopupR = radius + 105;
        var popupW = 210, popupH = 64; // popup geometry unchanged

        // Center label (scaled with the wheel)
        svg.append('text').attr('x', cx).attr('y', cy - 14)
            .attr('text-anchor', 'middle').attr('font-size', '22px')
            .attr('font-weight', '700').attr('fill', '#1a2e44')
            .text('Iterative');
        svg.append('text').attr('x', cx).attr('y', cy + 12)
            .attr('text-anchor', 'middle').attr('font-size', '22px')
            .attr('font-weight', '700').attr('fill', '#1a2e44')
            .text('Development');
        svg.append('text').attr('x', cx).attr('y', cy + 38)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#555').attr('font-weight', '600')
            .text('(not waterfall)');

        // Direction arrows on the loop
        steps.forEach(function (step, i) {
            var angle = (i / n) * 2 * Math.PI - Math.PI / 2;
            var nextAngle = ((i + 1) / n) * 2 * Math.PI - Math.PI / 2;
            var midAngle = (angle + nextAngle) / 2;
            var arrowR = radius - 2;
            var ax = cx + arrowR * Math.cos(midAngle);
            var ay = cy + arrowR * Math.sin(midAngle);
            svg.append('text').attr('x', ax).attr('y', ay + 4)
                .attr('text-anchor', 'middle').attr('font-size', '22px')
                .attr('fill', '#888')
                .attr('transform', 'rotate(' + (midAngle * 180 / Math.PI + 90) + ',' + ax + ',' + ay + ')')
                .text('▸')
                .style('opacity', 0)
                .transition().delay(n * 200 + i * 100).duration(300).style('opacity', 0.7);
        });

        // Security & compliance envelope (drawn under nodes)
        var ringR = radius + 62;
        svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', ringR)
            .attr('fill', 'none').attr('stroke', '#c0392b')
            .attr('stroke-width', 2).attr('stroke-dasharray', '8,6')
            .attr('opacity', 0.45);
        // Caption moved UNDER the diagram (just below the ring, on the bottom side)
        svg.append('text').attr('x', cx).attr('y', cy + ringR + 26)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#c0392b').attr('font-weight', '700')
            .attr('letter-spacing', '2.2px')
            .text('SECURITY & COMPLIANCE — BAKED INTO EVERY STEP');

        // Popup layer (above nodes)
        var popupLayer = svg.append('g').attr('class', 'popup-layer');
        var nodeRefs = [];
        var popupRefs = [];

        // Nodes + paired popups
        steps.forEach(function (step, i) {
            var angle = (i / n) * 2 * Math.PI - Math.PI / 2;
            var nx = cx + radius * Math.cos(angle);
            var ny = cy + radius * Math.sin(angle);

            // Node
            var nodeG = svg.append('g')
                .attr('class', 'node-g')
                .attr('transform', 'translate(' + nx + ',' + ny + ')')
                .style('opacity', 0)
                .style('cursor', 'pointer');
            nodeG.append('circle').attr('class', 'node-circle').attr('r', nodeR)
                .attr('fill', step.bg)
                .attr('stroke', step.color).attr('stroke-width', 3);
            nodeG.append('text').attr('y', -10)
                .attr('text-anchor', 'middle').attr('font-size', '24px')
                .text(step.icon);
            nodeG.append('text').attr('y', 18)
                .attr('text-anchor', 'middle').attr('font-size', '14px')
                .attr('font-weight', '700').attr('fill', step.color)
                .text(step.label);
            nodeG.transition().delay(i * 200).duration(400).style('opacity', 1);
            nodeRefs.push(nodeG);

            // Popup, positioned radially outward (per-step override allows
            // pushing diagonal popups past the security ring)
            var thisPopupR = step.popupR || defaultPopupR;
            var px = cx + thisPopupR * Math.cos(angle);
            var py = cy + thisPopupR * Math.sin(angle);

            var popG = popupLayer.append('g')
                .attr('class', 'popup-g')
                .attr('transform', 'translate(' + px + ',' + py + ')')
                .style('opacity', 0)
                .style('pointer-events', 'none');

            // Connector: thin line from popup edge → node circle edge
            var dx = nx - px, dy = ny - py;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var ux = dx / dist, uy = dy / dist;
            var tx = (popupW / 2) / Math.max(0.0001, Math.abs(ux));
            var ty = (popupH / 2) / Math.max(0.0001, Math.abs(uy));
            var t = Math.min(tx, ty);
            var cStartX = t * ux, cStartY = t * uy;
            var cEndX = (nx - px) - nodeR * ux;
            var cEndY = (ny - py) - nodeR * uy;
            popG.append('line')
                .attr('x1', cStartX).attr('y1', cStartY)
                .attr('x2', cEndX).attr('y2', cEndY)
                .attr('stroke', step.color).attr('stroke-width', 1.4);

            // Bauhaus card: hard rectangle, hairline stroke, white fill
            popG.append('rect')
                .attr('x', -popupW / 2).attr('y', -popupH / 2)
                .attr('width', popupW).attr('height', popupH)
                .attr('fill', '#ffffff')
                .attr('stroke', step.color).attr('stroke-width', 1.5);

            // Signature color block (top-left)
            popG.append('rect')
                .attr('x', -popupW / 2 + 12).attr('y', -popupH / 2 + 11)
                .attr('width', 12).attr('height', 12)
                .attr('fill', step.color);

            // Label in caps, letter-spaced
            popG.append('text')
                .attr('x', -popupW / 2 + 32).attr('y', -popupH / 2 + 22)
                .attr('font-size', '10px').attr('font-weight', '700')
                .attr('fill', step.color).attr('letter-spacing', '1.6px')
                .text(step.label.toUpperCase());

            // Hairline accent rule
            popG.append('line')
                .attr('x1', -popupW / 2 + 12).attr('y1', -popupH / 2 + 30)
                .attr('x2', popupW / 2 - 12).attr('y2', -popupH / 2 + 30)
                .attr('stroke', step.color).attr('stroke-width', 0.6).attr('stroke-opacity', 0.55);

            // Sub-text (the moved label)
            popG.append('text')
                .attr('x', -popupW / 2 + 14).attr('y', -popupH / 2 + 50)
                .attr('font-size', '13.5px').attr('font-weight', '500')
                .attr('fill', '#1a2e44')
                .text(step.sub);

            popupRefs.push(popG);

            // Hover behavior — only show popup on mouse over
            nodeG.on('mouseenter', function () {
                nodeRefs.forEach(function (other, j) {
                    if (j !== i) other.transition().duration(160).style('opacity', 0.42);
                });
                d3.select(this).select('circle.node-circle')
                    .transition().duration(150).attr('stroke-width', 4);
                popG.transition().duration(180).style('opacity', 1);
            }).on('mouseleave', function () {
                nodeRefs.forEach(function (other) {
                    other.transition().duration(180).style('opacity', 1);
                });
                d3.select(this).select('circle.node-circle')
                    .transition().duration(150).attr('stroke-width', 3);
                popG.transition().duration(140).style('opacity', 0);
            });
        });
    }

    // ─── REALM OPERATIONS DIAGRAM ─────────────────────────────
    // Translates the Svelte REALM diagram into a D3 interactive visualization
    // Shows the continuum of care with systems spanning workflow stages
    function realmDiagram(container, config) {
        var W = 1100, H = 700;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");

        // Background
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', '#0f172a').attr('rx', 12);

        var stages = [
            { label: 'Person', icon: '👤' }, { label: 'Specimen', icon: '🧫' },
            { label: 'Accession', icon: '📋' }, { label: 'Grossing', icon: '🔬' },
            { label: 'Histology', icon: '🔍' }, { label: 'Molecular', icon: '🧬' },
            { label: 'Evaluation', icon: '📊' }, { label: 'Path. Dx', icon: '🩺' },
            { label: 'Reporting', icon: '📄' }, { label: 'Research', icon: '🎓' }
        ];

        var statusColors = {
            active:   { bg: 'rgba(34,197,94,0.16)',  border: '#22C55E' },
            evolving: { bg: 'rgba(245,158,11,0.16)', border: '#F59E0B' },
            retiring: { bg: 'rgba(239,68,68,0.16)',  border: '#f87171' },
            retired:  { bg: 'rgba(100,116,139,0.12)', border: '#64748B' }
        };

        var domainColors = {
            orchestration: { bg: 'rgba(139,92,246,0.28)', border: '#8B5CF6' },
            diagnostics:   { bg: 'rgba(244,114,182,0.28)', border: '#F472B6' },
            analytics:     { bg: 'rgba(129,140,248,0.28)', border: '#818CF8' },
            asset:         { bg: 'rgba(96,165,250,0.28)',  border: '#60A5FA' },
            research:      { bg: 'rgba(45,212,191,0.28)',  border: '#2DD4BF' }
        };

        var systems = [
            { label: 'Digital Path / AI Tools', startCol: 0, endCol: 9, row: 0, status: 'active', domain: 'diagnostics',
              desc: 'External AI and digital pathology technologies' },
            { label: 'DSA-WSI-DeID', startCol: 9, endCol: 10, row: 0, status: 'active', domain: 'research',
              desc: 'Digital Slide Archive & De-identification' },
            { label: 'FSLink', startCol: 0, endCol: 4, row: 1, status: 'evolving', domain: 'diagnostics',
              desc: 'Frozen Section Link — real-time intraoperative consultation' },
            { label: 'Histology Asset Tracking', startCol: 4, endCol: 7, row: 1, status: 'retiring', domain: 'asset',
              desc: 'Parts, blocks, slides, IHC tracking' },
            { label: 'Downstream', startCol: 7, endCol: 10, row: 1, status: 'retiring', domain: 'diagnostics',
              desc: 'Tumor DNA sequencing workflow' },
            { label: 'Pathology Portal / Starling / IBIS / Pelican', startCol: 2, endCol: 10, row: 2, status: 'active', domain: 'diagnostics',
              desc: 'Unified pathology-centric patient care view, clinician dashboards (Starling), Lucene-backed search & cohort discovery (IBIS), and operational analytics (Pelican)' },
            { label: 'Elasticsearch', startCol: 0, endCol: 10, row: 3, status: 'active', domain: 'analytics',
              desc: 'Advanced indexing & analytics across entire continuum' },
            { label: 'Hermes', startCol: 0, endCol: 10, row: 4, status: 'active', domain: 'orchestration',
              desc: 'Data exchange engine — HL7, FHIR, ASTM, custom protocols' },
            { label: 'RTSE', startCol: 0, endCol: 10, row: 5, status: 'active', domain: 'orchestration',
              desc: 'Repetitive Task Scheduling Engine — work orchestration' },
            { label: 'Footprints', startCol: 0, endCol: 4, row: 6, status: 'retiring', domain: 'asset',
              desc: 'Inter-laboratory specimen traffic monitoring' },
            { label: 'Spotlight', startCol: 4, endCol: 7, row: 6, status: 'active', domain: 'analytics',
              desc: 'D3.js/Observable analytics engine' },
            { label: 'eHisto', startCol: 8, endCol: 10, row: 6, status: 'active', domain: 'research',
              desc: 'Central Tissue Resource Lab' },
            { label: 'CoPath Plus → Beaker', startCol: 0, endCol: 10, row: 7, status: 'retiring', domain: 'asset',
              desc: 'LIS — being replaced by Epic Beaker' },
            { label: 'Dialogue — AI Engine', startCol: 0, endCol: 10, row: 8, status: 'active', domain: 'orchestration',
              desc: 'Generative AI for sophisticated clinical tasks' },
            { label: 'BdHub', startCol: 1, endCol: 10, row: 9, status: 'active', domain: 'research',
              desc: 'Biorepository data hub — specimen-level research data, audited, governed, and queryable across the pathology continuum' },
            { label: 'CHLOE', startCol: 0, endCol: 10, row: 10, status: 'active', domain: 'research',
              desc: 'Clinical query and cohort-assembly engine — domain-expert-driven research substrate spanning Person → Research' }
        ];

        // Layout constants
        var marginLeft = 30, marginTop = 60, stageBarH = 50;
        var gridLeft = marginLeft, gridTop = marginTop + stageBarH + 15;
        var gridW = W - marginLeft * 2, gridH = H - gridTop - 90;
        var colW = gridW / 10;
        var rowH = gridH / 11;

        // Continuum of Care bar
        var stageG = svg.append('g').attr('transform', 'translate(' + marginLeft + ',' + marginTop + ')');
        stageG.append('rect').attr('width', gridW).attr('height', stageBarH)
            .attr('rx', 8).attr('fill', '#1e293b').attr('stroke', '#334155').attr('stroke-width', 1);

        stages.forEach(function(st, i) {
            var cx = i * colW + colW / 2;
            var g = stageG.append('g').attr('transform', 'translate(' + cx + ', 0)')
                .style('cursor', 'pointer').style('opacity', 0);

            g.append('rect').attr('x', -colW/2 + 2).attr('y', 2).attr('width', colW - 4).attr('height', stageBarH - 4)
                .attr('rx', 6).attr('fill', '#334155').attr('fill-opacity', 0.6);
            g.append('text').attr('y', 22).attr('text-anchor', 'middle')
                .attr('font-size', '16px').text(st.icon);
            g.append('text').attr('y', 40).attr('text-anchor', 'middle')
                .attr('font-size', '9px').attr('fill', '#94a3b8').attr('font-weight', 500)
                .text(st.label);

            g.on('mouseover', function() {
                // Highlight column
                svg.selectAll('.grid-col-' + i).attr('fill-opacity', 0.08);
                // Dim non-matching systems
                svg.selectAll('.sys-bar').each(function() {
                    var sCol = +d3.select(this).attr('data-start');
                    var eCol = +d3.select(this).attr('data-end');
                    if (i < sCol || i >= eCol) {
                        d3.select(this).transition().duration(150).style('opacity', 0.15);
                    } else {
                        d3.select(this).transition().duration(150).style('opacity', 1)
                            .attr('transform', 'scale(1, 1.08)');
                    }
                });
            }).on('mouseout', function() {
                svg.selectAll('.grid-col-' + i).attr('fill-opacity', 0);
                svg.selectAll('.sys-bar').transition().duration(200)
                    .style('opacity', 1).attr('transform', 'scale(1, 1)');
            });

            // Staggered entry
            g.transition().delay(100 + i * 60).duration(400).style('opacity', 1);
        });

        // Systems area background
        var sysG = svg.append('g').attr('transform', 'translate(' + gridLeft + ',' + gridTop + ')');
        sysG.append('rect').attr('width', gridW).attr('height', gridH)
            .attr('rx', 10).attr('fill', '#1e293b').attr('stroke', '#334155').attr('stroke-width', 1);

        // Grid column indicators (for hover)
        for (var ci = 0; ci < 10; ci++) {
            sysG.append('rect').attr('class', 'grid-col-' + ci)
                .attr('x', ci * colW).attr('y', 0).attr('width', colW).attr('height', gridH)
                .attr('fill', '#3b82f6').attr('fill-opacity', 0);
            // Subtle column dividers
            if (ci > 0) {
                sysG.append('line').attr('x1', ci * colW).attr('y1', 4)
                    .attr('x2', ci * colW).attr('y2', gridH - 4)
                    .attr('stroke', '#334155').attr('stroke-width', 0.5).attr('stroke-dasharray', '2,4')
                    .attr('opacity', 0.4);
            }
        }

        // Tooltip
        var tooltip = d3.select(container).append('div')
            .style('position', 'absolute').style('bottom', '10px').style('left', '50%')
            .style('transform', 'translateX(-50%)').style('background', '#1e293b')
            .style('border', '1px solid #475569').style('border-radius', '10px')
            .style('padding', '10px 16px').style('color', '#f8fafc')
            .style('font-size', '13px').style('font-family', "'Inter', sans-serif")
            .style('pointer-events', 'none').style('opacity', 0).style('transition', 'opacity 0.2s')
            .style('max-width', '500px').style('text-align', 'center')
            .style('box-shadow', '0 8px 24px rgba(0,0,0,0.5)').style('z-index', 50);

        // Render system bars
        systems.forEach(function(sys, si) {
            var x = sys.startCol * colW + 3;
            var w = (sys.endCol - sys.startCol) * colW - 6;
            var y = sys.row * rowH + 4;
            var h = rowH - 8;
            var dc = domainColors[sys.domain] || { bg: 'rgba(100,116,139,0.2)', border: '#64748B' };
            var sc = statusColors[sys.status] || statusColors.active;

            var g = sysG.append('g').attr('class', 'sys-bar')
                .attr('data-start', sys.startCol).attr('data-end', sys.endCol)
                .style('cursor', 'pointer').style('opacity', 0);

            g.append('rect').attr('x', x).attr('y', y).attr('width', w).attr('height', h)
                .attr('rx', 5).attr('fill', dc.bg)
                .attr('stroke', sc.border).attr('stroke-width', 1.5);

            g.append('text').attr('x', x + w / 2).attr('y', y + h / 2 + 1)
                .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
                .attr('font-size', w > 200 ? '11px' : '9px')
                .attr('font-weight', 600).attr('fill', '#f0f0f0')
                .attr('font-family', "'JetBrains Mono', 'Menlo', monospace")
                .text(sys.label);

            // Status indicator dot
            g.append('circle').attr('cx', x + 10).attr('cy', y + 10).attr('r', 3)
                .attr('fill', sc.border);

            g.on('mouseover', function() {
                d3.select(this).select('rect').transition().duration(150)
                    .attr('stroke-width', 2.5).attr('stroke', '#ffffff');
                tooltip.html('<strong style="font-family: JetBrains Mono, monospace;">' + sys.label +
                    '</strong><span style="display:inline-block;margin-left:8px;padding:2px 6px;border-radius:3px;font-size:11px;background:' +
                    sc.bg + ';border:1px solid ' + sc.border + ';">' + sys.status + '</span>' +
                    '<br><span style="color:#94a3b8;font-size:12px;">' + sys.desc + '</span>')
                    .style('opacity', 1);
            }).on('mouseout', function() {
                d3.select(this).select('rect').transition().duration(200)
                    .attr('stroke-width', 1.5).attr('stroke', sc.border);
                tooltip.style('opacity', 0);
            });

            // Staggered cascade entry
            g.transition().delay(400 + si * 80).duration(500)
                .ease(d3.easeCubicOut).style('opacity', 1);
        });

        // Legend
        var legY = H - 40;
        var legData = [
            { label: 'Active', color: '#22C55E' }, { label: 'Evolving', color: '#F59E0B' },
            { label: 'Retiring', color: '#f87171' }, { label: 'Retired', color: '#64748B' }
        ];
        var domLeg = [
            { label: 'Workflow', color: domainColors.orchestration.border },
            { label: 'Diagnostics', color: domainColors.diagnostics.border },
            { label: 'Analytics', color: domainColors.analytics.border },
            { label: 'Assets', color: domainColors.asset.border },
            { label: 'Research', color: domainColors.research.border }
        ];

        var legG = svg.append('g').attr('transform', 'translate(' + marginLeft + ',' + legY + ')').style('opacity', 0);

        // Status legend
        legG.append('text').attr('x', 0).attr('y', 10).attr('font-size', '9px')
            .attr('fill', '#cbd5e1').attr('font-weight', 500).attr('text-transform', 'uppercase')
            .attr('letter-spacing', '0.05em').text('STATUS');
        legData.forEach(function(d, i) {
            legG.append('circle').attr('cx', 60 + i * 80).attr('cy', 7).attr('r', 4).attr('fill', d.color);
            legG.append('text').attr('x', 68 + i * 80).attr('y', 10).attr('font-size', '9px')
                .attr('fill', '#94a3b8').text(d.label);
        });

        // Domain legend
        legG.append('text').attr('x', 420).attr('y', 10).attr('font-size', '9px')
            .attr('fill', '#cbd5e1').attr('font-weight', 500).text('ROLE');
        domLeg.forEach(function(d, i) {
            legG.append('rect').attr('x', 460 + i * 100).attr('y', 2).attr('width', 12).attr('height', 12)
                .attr('rx', 2).attr('fill', d.color).attr('fill-opacity', 0.3)
                .attr('stroke', d.color).attr('stroke-width', 1);
            legG.append('text').attr('x', 476 + i * 100).attr('y', 11).attr('font-size', '9px')
                .attr('fill', '#94a3b8').text(d.label);
        });

        legG.transition().delay(1200).duration(500).style('opacity', 1);
    }


    // ─── FEEDBACK LOOP COMPARISON (animated) ────────────────────
    // Shows Old Loop (hours) vs New Loop (minutes) as animated cycle diagrams
    function feedbackLoop(container, config) {
        // Color recalibration — the slide is one of the central arguments of the
        // talk, so the palette is reworked for:
        //   • colorblind safety (cool↔warm contrast, not red↔green)
        //   • temperature semantics (cool = considered/slow, warm = energetic/fast)
        //   • WCAG-AA text contrast against the warm-cream background
        //   • visual hierarchy: the orbiting dots POP (kinetic), the loops sit
        //     calmly, and labels remain quietly legible
        var W = 1050, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");

        // Warm-cream paper background (matches jig, cognitive-load,
        // metaphor-to-mechanism, ideas-not-zombies — the deck's epistemic vizzes)
        var BG    = '#faf7f1';
        var INK   = '#1f1a14';
        var MUTED = '#6b5c48';
        var RULE  = '#a89c85';

        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', BG).attr('rx', 4);

        // Cool↔warm temperature pair (colorblind-safe across all common forms;
        // both colors pass AA contrast against #faf7f1)
        var SLATE     = '#3d5b73';   // old loop — considered, anchored
        var SLATE_DK  = '#1f3447';   // for emphasized text on cream
        var COPPER    = '#a36015';   // new loop — energetic, ignited
        var COPPER_DK = '#7a460c';   // for emphasized text on cream
        var COPPER_HI = '#e89438';   // brighter copper for kinetic orbit dot

        var loops = [
            { cx: 240, cy: 210, r: 140, label: 'Old Loop', time: 'Hours → Days',
              color: SLATE, colorDark: SLATE_DK, orbitColor: SLATE,
              bgFill: 'rgba(61,91,115,0.07)',
              steps: ['Write', 'Compile', 'Test', 'Debug', 'Revise'],
              speedLabel: 'COMMIT or ABANDON' },
            { cx: 810, cy: 210, r: 140, label: 'New Loop', time: 'Minutes',
              color: COPPER, colorDark: COPPER_DK, orbitColor: COPPER_HI,
              bgFill: 'rgba(163,96,21,0.07)',
              steps: ['Describe', 'Evaluate', 'Adjust'],
              speedLabel: 'EXPLORE freely' }
        ];

        // Center divider — soft warm taupe so it reads as neutral ground
        svg.append('line').attr('x1', W/2).attr('y1', 30).attr('x2', W/2).attr('y2', H - 30)
            .attr('stroke', RULE).attr('stroke-width', 1).attr('stroke-dasharray', '4,4')
            .attr('opacity', 0.55);
        svg.append('text').attr('x', W/2).attr('y', H/2)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', MUTED).attr('font-weight', 600).text('vs');

        loops.forEach(function(loop, li) {
            var g = svg.append('g').style('opacity', 0);
            var n = loop.steps.length;

            // Background circle — quiet temperature wash
            g.append('circle').attr('cx', loop.cx).attr('cy', loop.cy).attr('r', loop.r)
                .attr('fill', loop.bgFill).attr('stroke', loop.color)
                .attr('stroke-width', 1).attr('stroke-opacity', 0.5);

            // Title above — emphasized loop color
            g.append('text').attr('x', loop.cx).attr('y', 30)
                .attr('text-anchor', 'middle').attr('font-size', '17px')
                .attr('font-weight', 700).attr('fill', loop.colorDark).text(loop.label);
            g.append('text').attr('x', loop.cx).attr('y', 50)
                .attr('text-anchor', 'middle').attr('font-size', '12.5px')
                .attr('fill', MUTED).attr('font-style', 'italic').text(loop.time);

            // Center "speed label" — emphasized so it reads at distance
            g.append('text').attr('x', loop.cx).attr('y', loop.cy - 6)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('font-weight', 700).attr('letter-spacing', '1.5px')
                .attr('fill', loop.colorDark).text(loop.speedLabel);

            // Layer order matters: arrows go BEHIND nodes so they don't cut
            // through the white-filled circles or overlap step labels.
            var arrowsLayer = g.append('g').attr('class', 'arrows-layer');
            var nodesLayer  = g.append('g').attr('class', 'nodes-layer');

            // Pass 1 — arrows (drawn first, so they sit behind nodes)
            loop.steps.forEach(function(step, i) {
                var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
                var x = loop.cx + Math.cos(angle) * (loop.r - 20);
                var y = loop.cy + Math.sin(angle) * (loop.r - 20);
                var nextAngle = ((i + 1) / n) * Math.PI * 2 - Math.PI / 2;
                var nx = loop.cx + Math.cos(nextAngle) * (loop.r - 20);
                var ny = loop.cy + Math.sin(nextAngle) * (loop.r - 20);
                var midAngle = ((i + 0.5) / n) * Math.PI * 2 - Math.PI / 2;
                var mx = loop.cx + Math.cos(midAngle) * (loop.r - 5);
                var my = loop.cy + Math.sin(midAngle) * (loop.r - 5);

                var arcPath = 'M ' + x + ' ' + y + ' Q ' + mx + ' ' + my + ' ' + nx + ' ' + ny;
                var arrow = arrowsLayer.append('path').attr('d', arcPath)
                    .attr('fill', 'none').attr('stroke', loop.color)
                    .attr('stroke-width', 1.6).attr('stroke-opacity', 0.6)
                    .attr('marker-end', 'url(#arrow-' + li + ')');

                arrow.style('opacity', 0).transition()
                    .delay(600 + li * 500 + i * 120).duration(300).style('opacity', 1);
            });

            // Pass 2 — nodes (drawn second, so they sit on top of arrows)
            // Light fill / colored stroke / dark text
            loop.steps.forEach(function(step, i) {
                var angle = (i / n) * Math.PI * 2 - Math.PI / 2;
                var x = loop.cx + Math.cos(angle) * (loop.r - 20);
                var y = loop.cy + Math.sin(angle) * (loop.r - 20);

                var node = nodesLayer.append('g').style('opacity', 0);
                node.append('circle').attr('cx', x).attr('cy', y).attr('r', 23)
                    .attr('fill', '#ffffff')
                    .attr('stroke', loop.color).attr('stroke-width', 2);
                node.append('text').attr('x', x).attr('y', y + 1)
                    .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
                    .attr('font-size', '10.5px').attr('font-weight', 600)
                    .attr('fill', INK).text(step);

                node.transition().delay(400 + li * 500 + i * 120).duration(400)
                    .ease(d3.easeCubicOut).style('opacity', 1);
            });

            // Orbiting dot — kinetic emphasis (bright on the warm side, anchored on the cool)
            var orbitDot = g.append('circle').attr('r', 6).attr('fill', loop.orbitColor)
                .attr('stroke', '#ffffff').attr('stroke-width', 1.5)
                .attr('opacity', 0.95).attr('filter', 'url(#glow-fb)');

            function orbitAnimate() {
                var dur = li === 0 ? 6000 : 2000; // Old loop slower
                orbitDot.transition().duration(dur).ease(d3.easeLinear)
                    .attrTween('cx', function() {
                        return function(t) {
                            var a = t * Math.PI * 2 - Math.PI / 2;
                            return loop.cx + Math.cos(a) * (loop.r - 20);
                        };
                    })
                    .attrTween('cy', function() {
                        return function(t) {
                            var a = t * Math.PI * 2 - Math.PI / 2;
                            return loop.cy + Math.sin(a) * (loop.r - 20);
                        };
                    })
                    .on('end', orbitAnimate);
            }
            setTimeout(orbitAnimate, 1000 + li * 600);

            g.transition().delay(200 + li * 400).duration(500).style('opacity', 1);
        });

        // Arrow marker defs — recolored for the new palette
        var defs = svg.append('defs');
        [{ id: 0, color: SLATE }, { id: 1, color: COPPER }].forEach(function(m) {
            defs.append('marker').attr('id', 'arrow-' + m.id)
                .attr('viewBox', '0 0 10 10').attr('refX', 8).attr('refY', 5)
                .attr('markerWidth', 6).attr('markerHeight', 6).attr('orient', 'auto')
                .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z')
                .attr('fill', m.color).attr('opacity', 0.65);
        });
        // Soft glow for orbit dot — calmer than the original
        var filt = defs.append('filter').attr('id', 'glow-fb');
        filt.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'blur');
        var merge = filt.append('feMerge');
        merge.append('feMergeNode').attr('in', 'blur');
        merge.append('feMergeNode').attr('in', 'SourceGraphic');

        // Bottom annotation — quiet warm-brown italic
        svg.append('text').attr('x', W/2).attr('y', H - 10)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', MUTED).attr('font-style', 'italic')
            .text("Speed doesn’t just change how fast you work. It changes how you think.");
    }


    // ─── COGNITIVE LOAD REDISTRIBUTION (proportional area) ──────
    function cognitiveLoad(container, config) {
        var W = 1050, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Warm-cream background — matches jig, metaphor-to-mechanism, ideas-not-zombies, etc.
        // (The slide's external section background is dark; without this rect, the dark text
        //  designed for a light surface disappears into the navy.)
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', '#faf7f1').attr('rx', 4);

        // Dark text colors for each segment — high contrast on light fills
        var darkText = {
            '#c0392b': '#7a1f1a', '#e67e22': '#8a4c15', '#f39c12': '#8a5a0c',
            '#27ae60': '#18693a', '#2980b9': '#1a5276', '#8e44ad': '#5b2d71'
        };

        var scenarios = [
            { label: 'Before AI', x: 80,
              segments: [
                { label: 'Syntax & Boilerplate', pct: 0.40, color: '#c0392b' },
                { label: 'API Lookup / Setup', pct: 0.20, color: '#e67e22' },
                { label: 'Debugging', pct: 0.15, color: '#f39c12' },
                { label: 'Architectural Judgment', pct: 0.15, color: '#27ae60' },
                { label: 'Domain Thinking', pct: 0.10, color: '#2980b9' }
              ]
            },
            { label: 'With AI (projected)', x: 570,
              segments: [
                { label: 'Syntax & Boilerplate', pct: 0.08, color: '#c0392b' },
                { label: 'API Lookup / Setup', pct: 0.05, color: '#e67e22' },
                { label: 'Evaluation & Review', pct: 0.22, color: '#8e44ad' },
                { label: 'Architectural Judgment', pct: 0.35, color: '#27ae60' },
                { label: 'Domain Thinking', pct: 0.30, color: '#2980b9' }
              ]
            }
        ];

        var barW = 380, barH = 30, startY = 80;

        // Arrow between scenarios
        svg.append('line').attr('x1', 480).attr('y1', H/2).attr('x2', 545).attr('y2', H/2)
            .attr('stroke', '#64748b').attr('stroke-width', 2).attr('marker-end', 'url(#arr-cl)');
        svg.append('text').attr('x', 512).attr('y', H/2 - 10)
            .attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', '#1f2937')
            .attr('font-weight', 600).text('AI shift');

        var defs = svg.append('defs');
        defs.append('marker').attr('id', 'arr-cl').attr('viewBox', '0 0 10 10')
            .attr('refX', 8).attr('refY', 5).attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', '#64748b');

        scenarios.forEach(function(scen, si) {
            var g = svg.append('g').style('opacity', 0);

            // Title — dark ink on light slide background
            g.append('text').attr('x', scen.x + barW / 2).attr('y', startY - 20)
                .attr('text-anchor', 'middle').attr('font-size', '18px')
                .attr('font-weight', 700).attr('fill', '#1f2937').text(scen.label);

            var cumY = startY;
            scen.segments.forEach(function(seg, i) {
                var segH = seg.pct * 260;
                var segG = g.append('g').style('opacity', 0);

                // Stronger fill so the bar reads clearly
                segG.append('rect').attr('x', scen.x).attr('y', cumY)
                    .attr('width', barW).attr('height', segH)
                    .attr('fill', seg.color).attr('fill-opacity', 0.22)
                    .attr('stroke', seg.color).attr('stroke-width', 1.5).attr('stroke-opacity', 0.85)
                    .attr('rx', 3);

                // Label inside bar — dark text for contrast
                var txtColor = darkText[seg.color] || '#1e293b';
                if (segH > 20) {
                    segG.append('text').attr('x', scen.x + 12).attr('y', cumY + segH / 2 + 1)
                        .attr('dominant-baseline', 'middle')
                        .attr('font-size', segH > 35 ? '12px' : '10px')
                        .attr('fill', txtColor).attr('font-weight', 600)
                        .text(seg.label);

                    segG.append('text').attr('x', scen.x + barW - 12).attr('y', cumY + segH / 2 + 1)
                        .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
                        .attr('font-size', '13px').attr('font-weight', 700)
                        .attr('fill', txtColor).text(Math.round(seg.pct * 100) + '%');
                }

                segG.transition().delay(300 + si * 500 + i * 100).duration(400)
                    .ease(d3.easeCubicOut).style('opacity', 1);

                cumY += segH;
            });

            g.transition().delay(200 + si * 400).duration(400).style('opacity', 1);
        });

        // Methodology sub-labels under column titles (slightly darker for legibility)
        svg.append('text').attr('x', 80 + barW / 2).attr('y', startY - 5)
            .attr('text-anchor', 'middle').attr('font-size', '9.5px')
            .attr('fill', '#5b5345').attr('font-style', 'italic')
            .text('Microsoft Time Warp 2024 · IDC · JetBrains 2025');
        svg.append('text').attr('x', 570 + barW / 2).attr('y', startY - 5)
            .attr('text-anchor', 'middle').attr('font-size', '9.5px')
            .attr('fill', '#5b5345').attr('font-style', 'italic')
            .text('METR 2025 + Feb 2026 update · arXiv SLR 2025 · SO Survey');

        // Annotation: what freed up
        var annG = svg.append('g').style('opacity', 0);
        annG.append('text').attr('x', W / 2).attr('y', H - 18)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#1f2937').attr('font-weight', 600)
            .text('Freed: Architectural judgment.');

        // Discoverable source link
        annG.append('text').attr('x', W / 2).attr('y', H - 2)
            .attr('text-anchor', 'middle').attr('font-size', '9.5px')
            .attr('fill', '#5b5345').attr('font-style', 'italic')
            .attr('class', 'source-ref')
            .text('Sources & methodology → see Sources slide');

        annG.transition().delay(1800).duration(500).style('opacity', 1);
    }


    // ─── BLANK PAGE (Malevich + white paper diptych) ────────────
    // Left: Malevich's Black Square as the zero-point — the terrifying void
    // Right: The pristine white page — beautiful until you must mark it
    // Center: AI dissolves the threshold — the first mark appears
    function blankPage(container, config) {
        var W = 1050, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var panelW = 320, panelH = 280, panelY = 30;
        var leftX = 50, rightX = W - 50 - panelW;
        var centerX = W / 2;

        // ── LEFT PANEL: Malevich's Black Square ──────────────
        var leftG = svg.append('g').style('opacity', 0);

        // Outer frame (gallery white border, then the square)
        leftG.append('rect').attr('x', leftX).attr('y', panelY)
            .attr('width', panelW).attr('height', panelH)
            .attr('fill', '#f5f0eb').attr('stroke', '#d4cdc4').attr('stroke-width', 1).attr('rx', 2);

        // The Black Square itself — inset like a painting
        var sqInset = 40;
        var sqSize = panelW - sqInset * 2;
        leftG.append('rect')
            .attr('x', leftX + sqInset).attr('y', panelY + 25)
            .attr('width', sqSize).attr('height', sqSize)
            .attr('fill', '#0a0a0a').attr('rx', 1);

        // Caption beneath
        leftG.append('text').attr('x', leftX + panelW / 2).attr('y', panelY + panelH + 22)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', 700)
            .text('Kazimir Malevich, 1915');
        leftG.append('text').attr('x', leftX + panelW / 2).attr('y', panelY + panelH + 38)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('"The zero point of painting"');
        leftG.append('text').attr('x', leftX + panelW / 2).attr('y', panelY + panelH + 54)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280')
            .text('Before creation, there is nothing. And nothing is terrifying.');

        leftG.transition().delay(300).duration(800).ease(d3.easeCubicOut).style('opacity', 1);

        // ── RIGHT PANEL: The White Page ──────────────────────
        var rightG = svg.append('g').style('opacity', 0);

        // Paper with subtle shadow (the beautiful unmarked sheet)
        rightG.append('rect').attr('x', rightX + 3).attr('y', panelY + 3)
            .attr('width', panelW).attr('height', panelH)
            .attr('fill', '#e5e7eb').attr('rx', 2); // shadow
        rightG.append('rect').attr('x', rightX).attr('y', panelY)
            .attr('width', panelW).attr('height', panelH)
            .attr('fill', '#ffffff').attr('stroke', '#d1d5db').attr('stroke-width', 0.5).attr('rx', 1);

        // Faint ruled lines (the invitation of structure)
        for (var li = 0; li < 9; li++) {
            var ly = panelY + 40 + li * 28;
            rightG.append('line')
                .attr('x1', rightX + 30).attr('y1', ly)
                .attr('x2', rightX + panelW - 30).attr('y2', ly)
                .attr('stroke', '#e5e7eb').attr('stroke-width', 0.5);
        }

        // Blinking cursor on the first line (the paralysis point)
        var cursor = rightG.append('rect')
            .attr('x', rightX + 30).attr('y', panelY + 32)
            .attr('width', 2).attr('height', 16)
            .attr('fill', '#374151');

        // Animate cursor blink
        function blink() {
            cursor.transition().duration(500).attr('fill-opacity', 0)
                .transition().duration(500).attr('fill-opacity', 1)
                .on('end', blink);
        }

        // Caption beneath
        rightG.append('text').attr('x', rightX + panelW / 2).attr('y', panelY + panelH + 22)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', 700)
            .text('The Blank Page');
        rightG.append('text').attr('x', rightX + panelW / 2).attr('y', panelY + panelH + 38)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('It is not empty;');
        rightG.append('text').attr('x', rightX + panelW / 2).attr('y', panelY + panelH + 54)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280')
            .text('it is crowded with unrealized beginnings.');

        rightG.transition().delay(600).duration(800).ease(d3.easeCubicOut).style('opacity', 1)
            .on('end', blink);

        // ── CENTER: The dissolution ──────────────────────────
        var midG = svg.append('g').style('opacity', 0);

        // Vertical line connecting the two worlds
        midG.append('line')
            .attr('x1', centerX).attr('y1', panelY + 40)
            .attr('x2', centerX).attr('y2', panelY + panelH - 40)
            .attr('stroke', '#d1d5db').attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4');

        // The pivot text
        midG.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 - 24)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#6b7280').text('The obstacle was');
        midG.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 - 4)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#1f2937').attr('font-weight', 700).text('the first mark.');
        midG.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 + 20)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#6b7280').text('AI made the cost');
        midG.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 + 40)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#1f2937').attr('font-weight', 700).text('zero.');

        // Small arrows pointing to each panel
        midG.append('text').attr('x', centerX - 50).attr('y', panelY + panelH / 2 + 5)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#6b7280').text('←');
        midG.append('text').attr('x', centerX + 50).attr('y', panelY + panelH / 2 + 5)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#6b7280').text('→');

        midG.transition().delay(1200).duration(600).ease(d3.easeCubicOut).style('opacity', 1);

        // ── BOTTOM: The shift statement ──────────────────────
        var bottomG = svg.append('g').style('opacity', 0);
        bottomG.append('text').attr('x', centerX).attr('y', H - 18)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', 600)
            .text('The real work becomes curation and judgment — not generation.');
        bottomG.append('text').attr('x', centerX).attr('y', H - 2)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('A plausible wrong answer is harder to catch than no answer at all.');

        bottomG.transition().delay(1800).duration(500).style('opacity', 1);

        // ══════════════════════════════════════════════════════════
        // PHASE 2 — Click to dissolve the blank page anxiety
        // Clinical data model appears on black, requirements on white
        // ══════════════════════════════════════════════════════════

        var phase2Triggered = false;

        // ── Left: Clinical data model (white on black) ──
        var sqX = leftX + sqInset;
        var sqY = panelY + 25;
        var modelG = svg.append('g').style('opacity', 0);

        // Entity boxes
        var entities = [
            { name: 'Patient', x: sqX + 20, y: sqY + 16, w: 72, h: 28 },
            { name: 'Order', x: sqX + 130, y: sqY + 16, w: 60, h: 28 },
            { name: 'Specimen', x: sqX + 20, y: sqY + 72, w: 76, h: 28 },
            { name: 'Accession', x: sqX + 130, y: sqY + 72, w: 80, h: 28 },
            { name: 'Result', x: sqX + 72, y: sqY + 128, w: 60, h: 28 },
            { name: 'Report', x: sqX + 160, y: sqY + 128, w: 60, h: 28 }
        ];

        entities.forEach(function (ent, i) {
            modelG.append('rect')
                .attr('x', ent.x).attr('y', ent.y)
                .attr('width', ent.w).attr('height', ent.h)
                .attr('rx', 3)
                .attr('fill', 'none')
                .attr('stroke', '#e5e7eb').attr('stroke-width', 1.2);

            modelG.append('text')
                .attr('x', ent.x + ent.w / 2).attr('y', ent.y + ent.h / 2 + 4)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('font-weight', '600').attr('fill', '#e5e7eb')
                .text(ent.name);
        });

        // Relationship lines
        var rels = [
            { x1: 92, y1: 30, x2: 130, y2: 30 },    // Patient → Order
            { x1: 58, y1: 44, x2: 58, y2: 72 },      // Patient → Specimen
            { x1: 170, y1: 44, x2: 170, y2: 72 },    // Order → Accession
            { x1: 96, y1: 100, x2: 102, y2: 128 },   // Specimen → Result
            { x1: 170, y1: 100, x2: 190, y2: 128 }   // Accession → Report
        ];

        rels.forEach(function (rel) {
            modelG.append('line')
                .attr('x1', sqX + rel.x1).attr('y1', sqY + rel.y1)
                .attr('x2', sqX + rel.x2).attr('y2', sqY + rel.y2)
                .attr('stroke', '#9ca3af').attr('stroke-width', 0.8)
                .attr('stroke-dasharray', '3,2');
        });

        // Small title in corner
        modelG.append('text')
            .attr('x', sqX + sqSize / 2).attr('y', sqY + sqSize - 12)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#cbd5e1').attr('letter-spacing', '1px')
            .text('CLINICAL DATA MODEL');

        // ── Right: User requirements appearing ──
        var reqG = svg.append('g').style('opacity', 0);

        var reqLines = [
            { text: 'User Requirements', size: '12px', weight: '700', fill: '#1f2937', y: panelY + 42 },
            { text: '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500', size: '9px', weight: '400', fill: '#d1d5db', y: panelY + 54 },
            { text: '1. System shall accept specimen', size: '10px', weight: '400', fill: '#374151', y: panelY + 74 },
            { text: '   accessioning via barcode scan', size: '10px', weight: '400', fill: '#374151', y: panelY + 88 },
            { text: '2. Results must route to ordering', size: '10px', weight: '400', fill: '#374151', y: panelY + 110 },
            { text: '   provider within 4 hours', size: '10px', weight: '400', fill: '#374151', y: panelY + 124 },
            { text: '3. Critical values trigger alert', size: '10px', weight: '400', fill: '#374151', y: panelY + 146 },
            { text: '   to on-call pathologist', size: '10px', weight: '400', fill: '#374151', y: panelY + 160 },
            { text: '4. Audit trail for all result', size: '10px', weight: '400', fill: '#374151', y: panelY + 182 },
            { text: '   amendments and addenda', size: '10px', weight: '400', fill: '#374151', y: panelY + 196 },
            { text: '5. Integration with Epic via', size: '10px', weight: '400', fill: '#374151', y: panelY + 218 },
            { text: '   HL7 FHIR endpoints', size: '10px', weight: '400', fill: '#374151', y: panelY + 232 }
        ];

        reqLines.forEach(function (line) {
            reqG.append('text')
                .attr('x', rightX + 32).attr('y', line.y)
                .attr('font-size', line.size)
                .attr('font-weight', line.weight)
                .attr('fill', line.fill)
                .text(line.text);
        });

        // ── Click handler to trigger phase 2 ──
        svg.style('cursor', 'pointer');

        svg.on('click', function () {
            if (phase2Triggered) return;
            phase2Triggered = true;
            svg.style('cursor', 'default');

            // Stop cursor blink — hide it
            cursor.interrupt().attr('fill-opacity', 0);

            // Fade in the data model on the black square
            modelG.transition().duration(1200).ease(d3.easeCubicOut)
                .style('opacity', 1);

            // Fade in requirements on the white page (staggered by line)
            reqG.style('opacity', 1);
            reqG.selectAll('text').style('opacity', 0)
                .each(function (d, i) {
                    d3.select(this).transition()
                        .delay(400 + i * 120)
                        .duration(400)
                        .ease(d3.easeCubicOut)
                        .style('opacity', 1);
                });

            // Update center text
            midG.selectAll('text').transition().duration(400).style('opacity', 0);
            midG.transition().delay(600).duration(0).each(function () {
                var mg = d3.select(this);
                mg.selectAll('text').remove();

                mg.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 - 16)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', '#6b7280').style('opacity', 0)
                    .text('The cost of the first mark')
                    .transition().duration(600).style('opacity', 1);

                mg.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 + 6)
                    .attr('text-anchor', 'middle').attr('font-size', '14px')
                    .attr('fill', '#065f46').attr('font-weight', 700).style('opacity', 0)
                    .text('is now zero.')
                    .transition().delay(200).duration(600).style('opacity', 1);

                mg.append('text').attr('x', centerX).attr('y', panelY + panelH / 2 + 34)
                    .attr('text-anchor', 'middle').attr('font-size', '11px')
                    .attr('fill', '#6b7280').style('opacity', 0)
                    .text('Now the real work begins.')
                    .transition().delay(500).duration(600).style('opacity', 1);
            });
        });
    }


    // ─── LIBERATION PATTERN (small multiples) ───────────────────
    // Four parallel collapses shown as before/after panels
    function liberationPattern(container, config) {
        var W = 1050, H = 420;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var patterns = [
            { constraint: 'Implementation\nBoilerplate', collapsed: 'First Draft\nCost', icon: '📝',
              color: '#3498db', detail: 'The cost of generating a first draft collapsed' },
            { constraint: 'Technology\nEvaluation', collapsed: 'Eval Tax', icon: '🔍',
              color: '#9b59b6', detail: 'The technology evaluation tax collapsed' },
            { constraint: 'Code Review\nas Ritual', collapsed: 'Blank-Canvas\nReview', icon: '👁️',
              color: '#e67e22', detail: 'The blank-canvas review problem collapsed' },
            { constraint: 'Slide Template\nas Only Format', collapsed: 'Switching\nCost', icon: '🖥️',
              color: '#27ae60', detail: 'The cost of code-driven presentation collapsed' }
        ];

        var cardW = 230, cardH = 300, gap = 20;
        var startX = (W - (cardW * 4 + gap * 3)) / 2;
        var startY = 30;

        patterns.forEach(function(pat, i) {
            var cx = startX + i * (cardW + gap);
            var g = svg.append('g').style('opacity', 0);

            // Card background
            g.append('rect').attr('x', cx).attr('y', startY).attr('width', cardW).attr('height', cardH)
                .attr('rx', 10).attr('fill', '#1e293b').attr('stroke', pat.color)
                .attr('stroke-width', 1).attr('stroke-opacity', 0.3);

            // Icon
            g.append('text').attr('x', cx + cardW / 2).attr('y', startY + 35)
                .attr('text-anchor', 'middle').attr('font-size', '24px').text(pat.icon);

            // "Before" block
            var bh = 70;
            g.append('rect').attr('x', cx + 15).attr('y', startY + 55).attr('width', cardW - 30).attr('height', bh)
                .attr('rx', 6).attr('fill', pat.color).attr('fill-opacity', 0.08)
                .attr('stroke', pat.color).attr('stroke-opacity', 0.2).attr('stroke-width', 1);

            // Constraint label (handle multiline)
            var cLines = pat.constraint.split('\n');
            cLines.forEach(function(line, li) {
                g.append('text').attr('x', cx + cardW / 2).attr('y', startY + 80 + li * 16)
                    .attr('text-anchor', 'middle').attr('font-size', '12px')
                    .attr('fill', '#e0e0e0').attr('font-weight', 600).text(line);
            });

            // Animated collapse arrow
            var arrowY = startY + 55 + bh + 10;
            var arrowG = g.append('g');

            // Tall bar that shrinks
            var tallBar = arrowG.append('rect').attr('x', cx + cardW / 2 - 20).attr('y', arrowY)
                .attr('width', 40).attr('height', 50)
                .attr('rx', 4).attr('fill', pat.color).attr('fill-opacity', 0.15)
                .attr('stroke', pat.color).attr('stroke-width', 1).attr('stroke-opacity', 0.4);

            // Arrow down
            arrowG.append('text').attr('x', cx + cardW / 2).attr('y', arrowY + 30)
                .attr('text-anchor', 'middle').attr('font-size', '18px')
                .attr('fill', pat.color).text('↓');

            // Collapse animation: bar shrinks after delay
            tallBar.transition().delay(1200 + i * 300).duration(800)
                .ease(d3.easeCubicIn)
                .attr('height', 8).attr('y', arrowY + 42).attr('fill-opacity', 0.4);

            // "After" block (collapsed state)
            var afterY = arrowY + 60;
            g.append('rect').attr('x', cx + 15).attr('y', afterY).attr('width', cardW - 30).attr('height', 30)
                .attr('rx', 6).attr('fill', pat.color).attr('fill-opacity', 0.2)
                .attr('stroke', pat.color).attr('stroke-opacity', 0.5).attr('stroke-width', 1.5);

            var aLines = pat.collapsed.split('\n');
            aLines.forEach(function(line, li) {
                g.append('text').attr('x', cx + cardW / 2).attr('y', afterY + 14 + li * 14)
                    .attr('text-anchor', 'middle').attr('font-size', '10px')
                    .attr('fill', pat.color).attr('font-weight', 700).text(line);
            });

            // Detail text at bottom
            g.append('text').attr('x', cx + cardW / 2).attr('y', startY + cardH - 15)
                .attr('text-anchor', 'middle').attr('font-size', '9px')
                .attr('fill', '#94a3b8').attr('font-style', 'italic')
                .text(pat.detail);

            // Staggered entry
            g.transition().delay(200 + i * 150).duration(500)
                .ease(d3.easeCubicOut).style('opacity', 1);
        });

        // Bottom annotation
        var ann = svg.append('g').style('opacity', 0);
        ann.append('text').attr('x', W / 2).attr('y', H - 15)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#ef5350').attr('font-weight', 700)
            .text('AI changed the price.');
        ann.transition().delay(2500).duration(500).style('opacity', 1);
    }


    // ─── STACK COMPARISON (structured data table) ───────────────
    // Elasticsearch vs Meilisearch as a Tufte-style comparison matrix
    function stackComparison(container, config) {
        var W = 1050, H = 380;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var criteria = [
            { label: 'Maturity',       elastic: 4.5, meili: 3.0 },
            { label: 'Setup Time',     elastic: 2.0, meili: 4.5 },
            { label: 'Resource Weight', elastic: 1.5, meili: 4.5 },
            { label: 'Typo Tolerance', elastic: 3.0, meili: 5.0 },
            { label: 'Clustering',     elastic: 5.0, meili: 1.0 },
            { label: 'Analytics Suite', elastic: 5.0, meili: 2.0 },
            { label: 'Relevance OOTB', elastic: 3.0, meili: 4.5 }
        ];

        var leftX = 350, rightX = 700, labelX = 200;
        var startY = 70, rowH = 38;
        var maxBarW = 120;

        // Headers
        svg.append('text').attr('x', leftX + maxBarW / 2).attr('y', 40)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', 700).attr('fill', '#c05702').text('Elasticsearch');
        svg.append('text').attr('x', rightX + maxBarW / 2).attr('y', 40)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', 700).attr('fill', '#1e8449').text('Meilisearch');

        criteria.forEach(function(crit, i) {
            var y = startY + i * rowH;
            var g = svg.append('g').style('opacity', 0);

            // Criterion label
            g.append('text').attr('x', labelX).attr('y', y + 14)
                .attr('text-anchor', 'end').attr('font-size', '12px')
                .attr('fill', '#64748b').attr('font-weight', 500).text(crit.label);

            // Dotted baseline
            g.append('line').attr('x1', labelX + 15).attr('y1', y + 10)
                .attr('x2', rightX + maxBarW + 30).attr('y2', y + 10)
                .attr('stroke', '#334155').attr('stroke-width', 0.5).attr('stroke-dasharray', '2,3');

            // Elastic bar (grows right from center)
            g.append('rect').attr('x', leftX).attr('y', y + 2)
                .attr('width', 0).attr('height', 16).attr('rx', 3)
                .attr('fill', '#e67e22').attr('fill-opacity', 0.25)
                .attr('stroke', '#e67e22').attr('stroke-width', 1).attr('stroke-opacity', 0.5)
                .transition().delay(400 + i * 80).duration(600)
                .attr('width', (crit.elastic / 5) * maxBarW);

            // Meili bar
            g.append('rect').attr('x', rightX).attr('y', y + 2)
                .attr('width', 0).attr('height', 16).attr('rx', 3)
                .attr('fill', '#27ae60').attr('fill-opacity', 0.25)
                .attr('stroke', '#27ae60').attr('stroke-width', 1).attr('stroke-opacity', 0.5)
                .transition().delay(400 + i * 80).duration(600)
                .attr('width', (crit.meili / 5) * maxBarW);

            // Score labels
            g.append('text').attr('x', leftX + (crit.elastic / 5) * maxBarW + 8).attr('y', y + 14)
                .attr('font-size', '10px').attr('fill', '#c05702').attr('font-weight', 600)
                .style('opacity', 0).text(crit.elastic.toFixed(1))
                .transition().delay(800 + i * 80).duration(300).style('opacity', 1);

            g.append('text').attr('x', rightX + (crit.meili / 5) * maxBarW + 8).attr('y', y + 14)
                .attr('font-size', '10px').attr('fill', '#1e8449').attr('font-weight', 600)
                .style('opacity', 0).text(crit.meili.toFixed(1))
                .transition().delay(800 + i * 80).duration(300).style('opacity', 1);

            g.transition().delay(200 + i * 60).duration(400).style('opacity', 1);
        });

        // Annotation
        svg.append('text').attr('x', W / 2).attr('y', H - 20)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#475569').attr('font-style', 'italic')
            .text('AI gives you access to more options. It does not tell you which one to pick.');
    }


    // ─── XENONYM BROWSER FRAME ──────────────────────────────────
    // Simulated browser window with schema → generated data preview
    function xenonymBrowser(container, config) {
        var W = 1050, H = 440;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Browser chrome
        var chromeH = 36;
        svg.append('rect').attr('width', W).attr('height', H).attr('rx', 10)
            .attr('fill', '#1e293b').attr('stroke', '#475569').attr('stroke-width', 1.5);
        svg.append('rect').attr('width', W).attr('height', chromeH).attr('rx', 10)
            .attr('fill', '#334155');
        // Hide bottom radius of chrome bar
        svg.append('rect').attr('y', chromeH - 10).attr('width', W).attr('height', 10)
            .attr('fill', '#334155');

        // Traffic lights
        [{ c: '#f87171', x: 18 }, { c: '#F59E0B', x: 34 }, { c: '#22C55E', x: 50 }].forEach(function(d) {
            svg.append('circle').attr('cx', d.x).attr('cy', chromeH / 2).attr('r', 5).attr('fill', d.c);
        });

        // URL bar
        svg.append('rect').attr('x', 120).attr('y', 8).attr('width', 500).attr('height', 20)
            .attr('rx', 10).attr('fill', '#1e293b');
        svg.append('text').attr('x', 135).attr('y', 22)
            .attr('font-size', '10px').attr('fill', '#94a3b8')
            .attr('font-family', "'JetBrains Mono', monospace")
            .text('🔒 xenonym.openpathology.org');

        // Link button
        var linkG = svg.append('g').style('cursor', 'pointer');
        linkG.append('rect').attr('x', 640).attr('y', 8).attr('width', 100).attr('height', 20)
            .attr('rx', 10).attr('fill', '#2563eb');
        linkG.append('text').attr('x', 690).attr('y', 22).attr('text-anchor', 'middle')
            .attr('font-size', '9px').attr('fill', 'white').attr('font-weight', 600).text('↗ Open Live');

        // Content area
        var contentY = chromeH + 10;

        // Left panel: Schema
        var schemaX = 20, schemaW = 350, schemaH = H - contentY - 20;
        svg.append('rect').attr('x', schemaX).attr('y', contentY)
            .attr('width', schemaW).attr('height', schemaH)
            .attr('rx', 8).attr('fill', '#0f172a').attr('stroke', '#334155').attr('stroke-width', 1);

        svg.append('text').attr('x', schemaX + 15).attr('y', contentY + 22)
            .attr('font-size', '10px').attr('fill', '#94a3b8').attr('font-weight', 600)
            .attr('text-transform', 'uppercase').attr('letter-spacing', '0.05em').text('SCHEMA INPUT');

        // JSON schema lines
        var schemaLines = [
            '{ "patient": {',
            '    "firstName": "xenonym:name",',
            '    "lastName": "xenonym:name",',
            '    "mrn": "xenonym:id(8)",',
            '    "dob": "xenonym:date",',
            '    "diagnosis": "xenonym:dx",',
            '    "specimen": {',
            '      "type": "xenonym:tissue",',
            '      "accession": "xenonym:acc"',
            '    }',
            '  }',
            '}'
        ];

        schemaLines.forEach(function(line, i) {
            svg.append('text').attr('x', schemaX + 20).attr('y', contentY + 50 + i * 18)
                .attr('font-size', '10px').attr('fill', '#e2e8f0')
                .attr('font-family', "'JetBrains Mono', monospace")
                .style('opacity', 0)
                .text(line)
                .transition().delay(300 + i * 60).duration(300).style('opacity', 1);
        });

        // Right panel: Generated output
        var outX = 400, outW = W - outX - 20;
        svg.append('rect').attr('x', outX).attr('y', contentY)
            .attr('width', outW).attr('height', schemaH)
            .attr('rx', 8).attr('fill', '#0f172a').attr('stroke', '#334155').attr('stroke-width', 1);

        svg.append('text').attr('x', outX + 15).attr('y', contentY + 22)
            .attr('font-size', '10px').attr('fill', '#22C55E').attr('font-weight', 600)
            .attr('text-transform', 'uppercase').attr('letter-spacing', '0.05em').text('GENERATED RECORDS');

        // Generated sample names (Xenonym-style)
        var generatedRecords = [
            { name: 'Kovani Trebesh',    mrn: '47382916', dx: 'Adenocarcinoma',          acc: 'S26-4821' },
            { name: 'Lirata Mendova',    mrn: '58291047', dx: 'Squamous cell carcinoma', acc: 'S26-4822' },
            { name: 'Selmak Durova',     mrn: '93817264', dx: 'Melanoma NOS',            acc: 'S26-4823' },
            { name: 'Nontra Null',       mrn: '00000000', dx: '⚠ SQL injection test',   acc: 'S26-TEST' },
            { name: 'Fenrik Čapešova',   mrn: '62918374', dx: 'Papillary thyroid ca.',   acc: 'S26-4824' },
            { name: "O'Mara-Sélekt",     mrn: '71629483', dx: '⚠ Edge case: apostrophe', acc: 'S26-ADV1' },
            { name: 'Volashi Nkembe',    mrn: '84726195', dx: 'Ductal carcinoma in situ', acc: 'S26-4825' }
        ];

        // Table header
        var cols = [
            { label: 'Name', x: outX + 15, w: 140 },
            { label: 'MRN', x: outX + 160, w: 80 },
            { label: 'Diagnosis', x: outX + 250, w: 200 },
            { label: 'Accession', x: outX + 460, w: 80 }
        ];

        cols.forEach(function(col) {
            svg.append('text').attr('x', col.x).attr('y', contentY + 50)
                .attr('font-size', '9px').attr('fill', '#94a3b8').attr('font-weight', 600)
                .text(col.label);
        });

        svg.append('line').attr('x1', outX + 10).attr('y1', contentY + 56)
            .attr('x2', outX + outW - 10).attr('y2', contentY + 56)
            .attr('stroke', '#334155').attr('stroke-width', 0.5);

        generatedRecords.forEach(function(rec, i) {
            var ry = contentY + 70 + i * 42;
            var isAdversarial = rec.name === 'Nontra Null' || rec.name === "O'Mara-Sélekt";
            var g = svg.append('g').style('opacity', 0);

            if (isAdversarial) {
                g.append('rect').attr('x', outX + 10).attr('y', ry - 10).attr('width', outW - 20).attr('height', 36)
                    .attr('rx', 4).attr('fill', '#c0392b').attr('fill-opacity', 0.08)
                    .attr('stroke', '#c0392b').attr('stroke-width', 0.5).attr('stroke-opacity', 0.3);
            }

            g.append('text').attr('x', cols[0].x).attr('y', ry + 4)
                .attr('font-size', '11px').attr('fill', isAdversarial ? '#f87171' : '#e2e8f0')
                .attr('font-weight', 600).text(rec.name);
            g.append('text').attr('x', cols[1].x).attr('y', ry + 4)
                .attr('font-size', '10px').attr('fill', '#94a3b8')
                .attr('font-family', "'JetBrains Mono', monospace").text(rec.mrn);
            g.append('text').attr('x', cols[2].x).attr('y', ry + 4)
                .attr('font-size', '10px').attr('fill', '#94a3b8').text(rec.dx);
            g.append('text').attr('x', cols[3].x).attr('y', ry + 4)
                .attr('font-size', '10px').attr('fill', '#94a3b8')
                .attr('font-family', "'JetBrains Mono', monospace").text(rec.acc);

            // Subtitle line
            if (rec.name === 'Nontra Null') {
                g.append('text').attr('x', cols[0].x).attr('y', ry + 18)
                    .attr('font-size', '8px').attr('fill', '#f87171').attr('font-style', 'italic')
                    .text('Bobby Tables is not a joke. It is a test case.');
            }

            g.transition().delay(800 + i * 100).duration(400).ease(d3.easeCubicOut).style('opacity', 1);
        });
    }


    // ─── META PRESENTATION ARCHITECTURE ─────────────────────────
    // Shows JSON → Render pipeline with live split-screen concept
    function presentationArchitecture(container, config) {
        var W = 1050, H = 400;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Left side: JSON layer
        var jsonX = 40, jsonW = 300, jsonH = 300, jsonY = 50;
        svg.append('rect').attr('x', jsonX).attr('y', jsonY).attr('width', jsonW).attr('height', jsonH)
            .attr('rx', 10).attr('fill', '#0f172a').attr('stroke', '#3b82f6')
            .attr('stroke-width', 1.5).attr('stroke-opacity', 0.4);

        svg.append('text').attr('x', jsonX + jsonW / 2).attr('y', jsonY - 10)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#60a5fa').attr('font-weight', 700).text('CONTENT LAYER');
        svg.append('text').attr('x', jsonX + jsonW / 2).attr('y', jsonY + 20)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#94a3b8').text('Structured JSON — version-controllable');

        // JSON snippet
        var jsonLines = [
            '{ "id": "governing-principle",',
            '  "type": "content",',
            '  "title": "The Governing..",',
            '  "takeaway": {',
            '    "text": "Most tool...",',
            '    "comment": "Speaker note"',
            '  }',
            '}'
        ];
        jsonLines.forEach(function(line, i) {
            svg.append('text').attr('x', jsonX + 20).attr('y', jsonY + 50 + i * 22)
                .attr('font-size', '10px').attr('fill', '#94a3b8')
                .attr('font-family', "'JetBrains Mono', monospace")
                .style('opacity', 0).text(line)
                .transition().delay(200 + i * 60).duration(300).style('opacity', 1);
        });

        // Properties labels
        var props = [
            { label: 'Human-readable', y: jsonY + jsonH - 60 },
            { label: 'AI-reviewable', y: jsonY + jsonH - 40 },
            { label: 'Git-diffable', y: jsonY + jsonH - 20 }
        ];
        props.forEach(function(p, i) {
            svg.append('text').attr('x', jsonX + 15).attr('y', p.y)
                .attr('font-size', '9px').attr('fill', '#22C55E').attr('font-weight', 500)
                .style('opacity', 0).text('✓ ' + p.label)
                .transition().delay(800 + i * 100).duration(300).style('opacity', 1);
        });

        // Center: Processing arrow
        var arrowCX = W / 2;
        var arrowG = svg.append('g').style('opacity', 0);

        arrowG.append('rect').attr('x', arrowCX - 60).attr('y', 150).attr('width', 120).attr('height', 60)
            .attr('rx', 30).attr('fill', '#1e293b').attr('stroke', '#475569').attr('stroke-width', 1);
        arrowG.append('text').attr('x', arrowCX).attr('y', 175)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#f0f0f0').attr('font-weight', 600).text('Slide Engine');
        arrowG.append('text').attr('x', arrowCX).attr('y', 195)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#94a3b8').text('D3 · Reveal.js · CSS');

        // Arrows in/out
        arrowG.append('line').attr('x1', jsonX + jsonW + 5).attr('y1', 180)
            .attr('x2', arrowCX - 65).attr('y2', 180)
            .attr('stroke', '#3b82f6').attr('stroke-width', 1.5)
            .attr('marker-end', 'url(#arr-meta)');

        arrowG.transition().delay(600).duration(500).style('opacity', 1);

        // Right side: Rendered output
        var outX = W - 340, outW = 300, outH = 300, outY = 50;
        svg.append('rect').attr('x', outX).attr('y', outY).attr('width', outW).attr('height', outH)
            .attr('rx', 10).attr('fill', '#0f172a').attr('stroke', '#27ae60')
            .attr('stroke-width', 1.5).attr('stroke-opacity', 0.4);

        svg.append('text').attr('x', outX + outW / 2).attr('y', outY - 10)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#27ae60').attr('font-weight', 700).text('RENDER LAYER');
        svg.append('text').attr('x', outX + outW / 2).attr('y', outY + 20)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#94a3b8').text('Browser application — full expressive power');

        // Arrow from engine to render
        svg.append('line').attr('x1', arrowCX + 65).attr('y1', 180)
            .attr('x2', outX - 5).attr('y2', 180)
            .attr('stroke', '#27ae60').attr('stroke-width', 1.5)
            .attr('marker-end', 'url(#arr-meta-g)').style('opacity', 0)
            .transition().delay(800).duration(400).style('opacity', 1);

        // Simulated rendered slide
        var rsG = svg.append('g').style('opacity', 0);
        rsG.append('rect').attr('x', outX + 20).attr('y', outY + 40).attr('width', outW - 40).attr('height', 180)
            .attr('rx', 6).attr('fill', '#1e293b');
        rsG.append('text').attr('x', outX + outW / 2).attr('y', outY + 80)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#f0f0f0').attr('font-weight', 700).text('The Governing Principle');
        rsG.append('text').attr('x', outX + outW / 2).attr('y', outY + 120)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#cbd5e1').attr('font-style', 'italic').text('"Automate what you do,');
        rsG.append('text').attr('x', outX + outW / 2).attr('y', outY + 140)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#cbd5e1').attr('font-style', 'italic').text('not do what is automated."');

        // Capabilities
        var caps = ['Live D3 visualizations', 'Interactive polling', 'Embedded applications'];
        caps.forEach(function(cap, i) {
            rsG.append('text').attr('x', outX + 25).attr('y', outY + outH - 50 + i * 16)
                .attr('font-size', '9px').attr('fill', '#27ae60').attr('font-weight', 500)
                .text('◆ ' + cap);
        });

        rsG.transition().delay(1000).duration(500).style('opacity', 1);

        // Bottom: "Separation of content from presentation — the Tufte principle applied"
        svg.append('text').attr('x', W / 2).attr('y', H - 15)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#94a3b8').attr('font-weight', 600)
            .text('Separation of content from presentation — the Tufte principle applied, not described.')
            .style('opacity', 0).transition().delay(1500).duration(500).style('opacity', 1);

        // Arrow markers
        var defs = svg.append('defs');
        defs.append('marker').attr('id', 'arr-meta').attr('viewBox', '0 0 10 10')
            .attr('refX', 8).attr('refY', 5).attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', '#3b82f6');
        defs.append('marker').attr('id', 'arr-meta-g').attr('viewBox', '0 0 10 10')
            .attr('refX', 8).attr('refY', 5).attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M 0 0 L 10 5 L 0 10 z').attr('fill', '#27ae60');
    }


    // ─── TUFTE TIMELINE (Minard-style) ────────────────────────
    // The slide about Tufte's critique was itself a bulleted list.
    // This visualization resolves the irony: a multi-variable
    // Minard-inspired graphic encoding PowerPoint dominance,
    // critique accumulation, switching cost, and the AI inflection.
    function tufteTimeline(container, config) {
        var W = 1100, H = 460;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        var tip = _createTooltip(container);

        // ── Layout regions (tuned to avoid all edge clipping) ──
        var margin = { left: 95, right: 35, top: 8, bandTop: 38, bandH: 78, eventY: 168, costTop: 230, costH: 114, bottom: 38 };
        var plotW = W - margin.left - margin.right;

        // ── Time scale ──
        var xScale = d3.scaleLinear().domain([2003, 2026]).range([margin.left, margin.left + plotW]);

        // ── BAND 1: PowerPoint dominance (narrower for cleaner layout) ──
        var pptData = [
            { year: 2003, width: 30 }, { year: 2006, width: 32 }, { year: 2010, width: 34 },
            { year: 2014, width: 34 }, { year: 2018, width: 33 }, { year: 2020, width: 33 },
            { year: 2022, width: 31 }, { year: 2023, width: 29 }, { year: 2024, width: 24 },
            { year: 2025, width: 18 }, { year: 2026, width: 12 }
        ];

        var bandMid = margin.bandTop + margin.bandH / 2;

        var areaPath = d3.area().curve(d3.curveMonotoneX)
            .x(function(d) { return xScale(d.year); })
            .y0(function(d) { return bandMid + d.width; })
            .y1(function(d) { return bandMid - d.width; });

        // Gradient: warm to cooling as dominance erodes
        var defs = svg.append('defs');
        var bandGrad = defs.append('linearGradient').attr('id', 'ppt-band-grad')
            .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
        bandGrad.append('stop').attr('offset', '0%').attr('stop-color', '#e67e22').attr('stop-opacity', 0.35);
        bandGrad.append('stop').attr('offset', '70%').attr('stop-color', '#e67e22').attr('stop-opacity', 0.25);
        bandGrad.append('stop').attr('offset', '100%').attr('stop-color', '#e67e22').attr('stop-opacity', 0.08);

        // Clip for reveal — starts at x=0 so left-edge labels are never clipped
        var clipId = 'tufte-clip-' + Math.random().toString(36).substr(2, 5);
        var clip = defs.append('clipPath').attr('id', clipId);
        var clipRect = clip.append('rect').attr('x', 0).attr('y', 0)
            .attr('width', 0).attr('height', H);

        var bandG = svg.append('g').attr('clip-path', 'url(#' + clipId + ')');

        // ── Highlight helpers (shared by bands, cost chart, and legend) ──
        var pptBandPath, altBandPath, costAreaPath, costLinePath;

        function highlightPPT(on) {
            pptBandPath.transition().duration(200)
                .style('filter', on ? 'brightness(1.8) drop-shadow(0 0 8px rgba(230,126,34,0.5))' : null)
                .attr('stroke-opacity', on ? 0.9 : 0.4).attr('stroke-width', on ? 2.5 : 1.5);
        }
        function highlightAlt(on) {
            altBandPath.transition().duration(200)
                .style('filter', on ? 'brightness(1.8) drop-shadow(0 0 8px rgba(39,174,96,0.5))' : null)
                .attr('stroke-opacity', on ? 0.9 : 0.5).attr('stroke-width', on ? 2.5 : 1.5);
        }
        function highlightCost(on) {
            costLinePath.transition().duration(200).attr('stroke-width', on ? 4 : 2.5);
            costAreaPath.transition().duration(200)
                .style('filter', on ? 'brightness(1.5) drop-shadow(0 0 6px rgba(192,57,43,0.4))' : null);
        }

        // ── PPT band (interactive) ──
        pptBandPath = bandG.append('path').datum(pptData)
            .attr('d', areaPath)
            .attr('fill', 'url(#ppt-band-grad)')
            .attr('stroke', '#e67e22').attr('stroke-width', 1.5).attr('stroke-opacity', 0.4)
            .style('cursor', 'pointer');

        pptBandPath.on('mouseenter', function() { highlightPPT(true); })
                   .on('mouseleave', function() { highlightPPT(false); });

        // Band label
        bandG.append('text').attr('x', xScale(2011)).attr('y', bandMid + 4)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#b35a00').attr('font-weight', 700).attr('letter-spacing', '2px')
            .text('POWERPOINT DOMINANCE');

        // ── CODE-BASED ALTERNATIVES band (diverges ~2023) ──
        var altOffset = bandMid + 34;
        var altData = [
            { year: 2020, width: 0 }, { year: 2022, width: 1 },
            { year: 2023, width: 4 }, { year: 2024, width: 12 },
            { year: 2025, width: 20 }, { year: 2026, width: 28 }
        ];

        var altGrad = defs.append('linearGradient').attr('id', 'alt-band-grad')
            .attr('x1', '0%').attr('y1', '0%').attr('x2', '100%').attr('y2', '0%');
        altGrad.append('stop').attr('offset', '0%').attr('stop-color', '#27ae60').attr('stop-opacity', 0.05);
        altGrad.append('stop').attr('offset', '100%').attr('stop-color', '#27ae60').attr('stop-opacity', 0.35);

        var altAreaPath = d3.area().curve(d3.curveMonotoneX)
            .x(function(d) { return xScale(d.year); })
            .y0(function(d) { return altOffset + d.width; })
            .y1(function(d) { return altOffset; });

        altBandPath = bandG.append('path').datum(altData)
            .attr('d', altAreaPath)
            .attr('fill', 'url(#alt-band-grad)')
            .attr('stroke', '#27ae60').attr('stroke-width', 1.5).attr('stroke-opacity', 0.5)
            .style('cursor', 'pointer');

        altBandPath.on('mouseenter', function() { highlightAlt(true); })
                   .on('mouseleave', function() { highlightAlt(false); });

        bandG.append('text').attr('x', xScale(2025.5)).attr('y', altOffset + 18)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#1a7a42').attr('font-weight', 700)
            .text('CODE-BASED');

        // ── EVENTS: critique milestones (dates & references verified) ──
        var events = [
            { year: 2003.5, label: 'Cognitive Style\nof PowerPoint', type: 'book', color: '#3498db',
              url: 'https://www.edwardtufte.com/book/the-cognitive-style-of-powerpoint-pitching-out-corrupts-within-ebook/',
              tip: '<strong>2003 — The Cognitive Style of PowerPoint</strong><br>Tufte publishes his seminal critique. PowerPoint "elevates format over content, betraying an attitude of commercialism that turns everything into a sales pitch."<br><a href="https://www.edwardtufte.com/book/the-cognitive-style-of-powerpoint-pitching-out-corrupts-within-ebook/" target="_blank" style="color:#3498db;font-size:11px">Source ↗</a>' },
            { year: 2004.3, label: '', type: 'analysis', color: '#e74c3c',
              url: 'https://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001yB',
              tip: '<strong>2003 — NASA Columbia Analysis</strong><br>Tufte demonstrates how PowerPoint\'s nested bullet format obscured the engineering data that could have prevented the Columbia disaster. The critique becomes canonical.<br><a href="https://www.edwardtufte.com/bboard/q-and-a-fetch-msg?msg_id=0001yB" target="_blank" style="color:#e74c3c;font-size:11px">Source ↗</a>' },
            { year: 2006, label: 'Beautiful\nEvidence', type: 'book', color: '#3498db',
              url: 'https://www.edwardtufte.com/book/beautiful-evidence/',
              tip: '<strong>2006 — Beautiful Evidence</strong><br>Tufte\'s fourth book extends the argument: evidence presentations should maximize data density, not minimize cognitive demand. The slideware chapter is devastating.<br><a href="https://www.edwardtufte.com/book/beautiful-evidence/" target="_blank" style="color:#3498db;font-size:11px">Source ↗</a>' },
            { year: 2010, label: 'Bumiller NYT:\n"Enemy Is PPT"', type: 'press', color: '#f39c12',
              url: 'https://www.nytimes.com/2010/04/27/world/27powerpoint.html',
              tip: '<strong>Apr 2010 — "We Have Met the Enemy and He Is PowerPoint"</strong><br>Elisabeth Bumiller\'s New York Times article. Gen. McChrystal\'s famous reaction to the Afghanistan spaghetti slide. The critique goes mainstream.<br><a href="https://www.nytimes.com/2010/04/27/world/27powerpoint.html" target="_blank" style="color:#f39c12;font-size:11px">Source ↗</a>' },
            { year: 2011.5, label: '', type: 'paper', color: '#9b59b6',
              url: 'https://www.sciencedirect.com/science/article/abs/pii/S0747563211002603',
              tip: '<strong>2011 — Academic Literature</strong><br>Peer-reviewed research in <em>Computers in Human Behavior</em> documents PowerPoint\'s effects on cognition and decision quality. The critique enters the academic mainstream.<br><a href="https://www.sciencedirect.com/science/article/abs/pii/S0747563211002603" target="_blank" style="color:#9b59b6;font-size:11px">Source ↗</a>' },
            { year: 2015, label: 'PPT Designer:\nReform Within', type: 'paper', color: '#9b59b6',
              url: 'https://www.microsoft.com/en-us/microsoft-365/blog/2015/11/13/the-evolution-of-powerpoint-introducing-designer-and-morph/',
              tip: '<strong>Nov 2015 — PowerPoint Designer &amp; Morph</strong><br>Microsoft introduces AI-powered slide design. Rather than questioning the format, they invest in making slides look better automatically. The fundamental constraint — the slide as the unit of thought — remains unaddressed.<br><a href="https://www.microsoft.com/en-us/microsoft-365/blog/2015/11/13/the-evolution-of-powerpoint-introducing-designer-and-morph/" target="_blank" style="color:#9b59b6;font-size:11px">Source ↗</a>' },
            { year: 2018, label: 'Bezos Memo\nBans PPT', type: 'event', color: '#f39c12',
              url: 'https://www.inc.com/carmine-gallo/jeff-bezos-bans-powerpoint-in-meetings-his-replacement-is-brilliant.html',
              tip: '<strong>2018 — Amazon Bans PowerPoint</strong><br>In his 2018 annual letter, Bezos confirms the six-page narrative memo rule. A high-profile exit from slideware — but the alternative trades one constraint for another.<br><a href="https://www.inc.com/carmine-gallo/jeff-bezos-bans-powerpoint-in-meetings-his-replacement-is-brilliant.html" target="_blank" style="color:#f39c12;font-size:11px">Source ↗</a>' },
            { year: 2023.5, label: 'AI collapses\nswitching cost', type: 'inflection', color: '#27ae60',
              url: 'https://github.blog/2023-03-22-github-copilot-x-the-ai-powered-developer-experience/',
              tip: '<strong>2023 — The Inflection</strong><br>GitHub Copilot X and ChatGPT make code-based presentations viable for non-programmers. The switching cost — the only thing protecting PowerPoint\'s dominance — collapses.<br><a href="https://github.blog/2023-03-22-github-copilot-x-the-ai-powered-developer-experience/" target="_blank" style="color:#27ae60;font-size:11px">Source ↗</a>' },
            { year: 2025.8, label: 'This\npresentation', type: 'proof', color: '#27ae60',
              url: null,
              tip: '<strong>2025 — The Proof</strong><br>You are looking at it. A JSON document rendered by a browser application. Each slide is a typed component. The visualizations are D3.js. The medium makes the argument.' }
        ];

        var eY = margin.eventY;
        var evtG = bandG.append('g');

        events.forEach(function(evt, i) {
            var ex = xScale(evt.year);
            var g = evtG.append('g').style('opacity', 0);

            // Vertical connector from band to event
            var connTop = bandMid + (evt.type === 'inflection' || evt.type === 'proof' ? 34 : 32);
            g.append('line').attr('x1', ex).attr('y1', connTop).attr('x2', ex).attr('y2', eY - 16)
                .attr('stroke', evt.color).attr('stroke-width', 1)
                .attr('stroke-dasharray', evt.type === 'inflection' ? 'none' : '3,3')
                .attr('stroke-opacity', 0.5);

            // Event dot
            var dotR = evt.type === 'inflection' || evt.type === 'proof' ? 6 : 4;
            g.append('circle').attr('cx', ex).attr('cy', eY - 16)
                .attr('r', dotR).attr('fill', evt.color).attr('fill-opacity', 0.9)
                .attr('stroke', evt.color).attr('stroke-width', 1.5);

            // Label — empty labels are tooltip-only; edge labels use smart anchoring
            var lines = evt.label ? evt.label.split('\n') : [];
            var textAnchor = 'middle';
            var textX = ex;
            // Prevent left-edge clipping: nudge label rightward if too close
            if (ex < margin.left + 45 && lines.length > 0) {
                textAnchor = 'start';
                textX = ex - 8;
            }
            // Prevent right-edge clipping
            if (ex > W - margin.right - 45 && lines.length > 0) {
                textAnchor = 'end';
                textX = ex + 8;
            }

            lines.forEach(function(line, li) {
                g.append('text').attr('x', textX).attr('y', eY + li * 13)
                    .attr('text-anchor', textAnchor).attr('font-size', '9px')
                    .attr('fill', evt.color).attr('font-weight', evt.type === 'inflection' ? 700 : 500)
                    .text(line);
            });

            // Type icon below label (or near dot if no label)
            var iconY = lines.length > 0 ? eY + lines.length * 13 + 4 : eY + 2;
            var icons = { book: '\ud83d\udcd5', analysis: '\u26a0', paper: '\ud83d\udcc4', press: '\ud83d\udcf0', event: '\ud83d\udeab', inflection: '\u26a1', proof: '\u25c6' };
            g.append('text').attr('x', ex).attr('y', iconY)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .text(icons[evt.type] || '\u2022');

            // Tooltip interaction
            var hitArea = g.append('rect').attr('x', ex - 35).attr('y', eY - 24)
                .attr('width', 70).attr('height', 55)
                .attr('fill', 'transparent').attr('cursor', 'pointer');

            hitArea.on('mouseenter', function() {
                _showTooltip(tip, evt.tip, Math.min(Math.max(ex - 130, 10), W - 290), eY + 50);
            }).on('mouseleave', function() {
                _hideTooltip(tip);
            }).on('click', function() {
                if (evt.url) window.open(evt.url, '_blank');
            });

            g.transition().delay(600 + i * 180).duration(400).style('opacity', 1);
        });

        // ── BOTTOM CHART: Switching Cost (interactive) ──
        var costY = margin.costTop;
        var costH = margin.costH;
        var costScale = d3.scaleLinear().domain([0, 100]).range([costY + costH, costY]);

        var costData = [
            { year: 2003, cost: 95 }, { year: 2006, cost: 93 }, { year: 2010, cost: 90 },
            { year: 2014, cost: 88 }, { year: 2018, cost: 85 }, { year: 2020, cost: 80 },
            { year: 2022, cost: 70 }, { year: 2023, cost: 45 }, { year: 2024, cost: 22 },
            { year: 2025, cost: 12 }, { year: 2026, cost: 6 }
        ];

        var costLine = d3.line().curve(d3.curveMonotoneX)
            .x(function(d) { return xScale(d.year); })
            .y(function(d) { return costScale(d.cost); });

        var costAreaGen = d3.area().curve(d3.curveMonotoneX)
            .x(function(d) { return xScale(d.year); })
            .y0(costY + costH)
            .y1(function(d) { return costScale(d.cost); });

        // Cost gradient
        var costGrad = defs.append('linearGradient').attr('id', 'cost-grad')
            .attr('x1', '0%').attr('y1', '0%').attr('x2', '0%').attr('y2', '100%');
        costGrad.append('stop').attr('offset', '0%').attr('stop-color', '#c0392b').attr('stop-opacity', 0.3);
        costGrad.append('stop').attr('offset', '100%').attr('stop-color', '#c0392b').attr('stop-opacity', 0.02);

        // Baseline
        bandG.append('line').attr('x1', margin.left).attr('y1', costY + costH)
            .attr('x2', margin.left + plotW).attr('y2', costY + costH)
            .attr('stroke', '#475569').attr('stroke-width', 0.5);

        costAreaPath = bandG.append('path').datum(costData).attr('d', costAreaGen)
            .attr('fill', 'url(#cost-grad)').style('cursor', 'pointer');

        costLinePath = bandG.append('path').datum(costData).attr('d', costLine)
            .attr('fill', 'none').attr('stroke', '#c0392b').attr('stroke-width', 2.5)
            .style('cursor', 'pointer');

        // Cost chart hover
        costAreaPath.on('mouseenter', function() { highlightCost(true); })
                    .on('mouseleave', function() { highlightCost(false); });
        costLinePath.on('mouseenter', function() { highlightCost(true); })
                    .on('mouseleave', function() { highlightCost(false); });

        // Cost labels
        bandG.append('text').attr('x', margin.left - 8).attr('y', costY + 8)
            .attr('text-anchor', 'end').attr('font-size', '9px')
            .attr('fill', '#c0392b').attr('font-weight', 600).text('HIGH');
        bandG.append('text').attr('x', margin.left - 8).attr('y', costY + costH - 2)
            .attr('text-anchor', 'end').attr('font-size', '9px')
            .attr('fill', '#c0392b').attr('font-weight', 600).text('LOW');

        // Y-axis label
        bandG.append('text')
            .attr('transform', 'translate(' + (margin.left - 50) + ',' + (costY + costH / 2) + ') rotate(-90)')
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#c0392b').attr('font-weight', 600).text('SWITCHING COST');

        // Cliff annotation
        var cliffX = xScale(2023);
        bandG.append('line').attr('x1', cliffX).attr('y1', costScale(45) - 5)
            .attr('x2', cliffX).attr('y2', costY + costH)
            .attr('stroke', '#c0392b').attr('stroke-width', 1).attr('stroke-dasharray', '4,3').attr('stroke-opacity', 0.5);

        // ── X-AXIS (years) ──
        var axisY = H - margin.bottom + 10;
        bandG.append('line').attr('x1', margin.left).attr('y1', axisY)
            .attr('x2', margin.left + plotW).attr('y2', axisY)
            .attr('stroke', '#475569').attr('stroke-width', 1);

        [2003, 2006, 2010, 2014, 2018, 2022, 2024, 2026].forEach(function(yr) {
            bandG.append('text').attr('x', xScale(yr)).attr('y', axisY + 14)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#475569').text(yr);
            bandG.append('line').attr('x1', xScale(yr)).attr('y1', axisY)
                .attr('x2', xScale(yr)).attr('y2', axisY + 4)
                .attr('stroke', '#475569').attr('stroke-width', 1);
        });

        // ── INTERACTIVE LEGEND (hover highlights corresponding region) ──
        var legItems = [
            { color: '#e67e22', label: 'PowerPoint dominance', hlFn: highlightPPT },
            { color: '#27ae60', label: 'Code-based alternatives', hlFn: highlightAlt },
            { color: '#c0392b', label: 'Switching cost', hlFn: highlightCost }
        ];
        var legX = W - margin.right - 200, legY = margin.top + 2;

        legItems.forEach(function(item, i) {
            var lg = svg.append('g').style('cursor', 'pointer');
            lg.append('rect').attr('x', legX - 4).attr('y', legY + i * 16 - 2)
                .attr('width', 200).attr('height', 15).attr('fill', 'transparent');
            lg.append('rect').attr('x', legX).attr('y', legY + i * 16)
                .attr('width', 10).attr('height', 10).attr('rx', 2)
                .attr('fill', item.color).attr('fill-opacity', 0.5);
            lg.append('text').attr('x', legX + 16).attr('y', legY + i * 16 + 9)
                .attr('font-size', '9px').attr('fill', '#475569').text(item.label);
            lg.on('mouseenter', function() { item.hlFn(true); })
              .on('mouseleave', function() { item.hlFn(false); });
        });

        // ── REVEAL ANIMATION: sweep right ──
        clipRect.transition().duration(3000).ease(d3.easeLinear)
            .attr('width', W);
    }


    // ─── GOVERNING PRINCIPLE: Bauhaus kinetic typography ─────
    function governingPrinciple(container, config) {
        var W = 1100, H = 500;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // ── Bauhaus palette ──
        var navy    = '#1B3A5C';
        var red     = '#C0392B';
        var gold    = '#D4A017';
        var slate   = '#475569';
        var bgWhite = '#FAFAF8';

        // Background: warm off-white with thin Bauhaus border
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', bgWhite).attr('rx', 0);
        svg.append('rect').attr('x', 18).attr('y', 18)
            .attr('width', W - 36).attr('height', H - 36)
            .attr('fill', 'none').attr('stroke', navy).attr('stroke-width', 2);

        // ── Bauhaus geometric accents ──
        // Top-left red square
        svg.append('rect').attr('x', 18).attr('y', 18)
            .attr('width', 28).attr('height', 28)
            .attr('fill', red);
        // Bottom-right gold square
        svg.append('rect').attr('x', W - 46).attr('y', H - 46)
            .attr('width', 28).attr('height', 28)
            .attr('fill', gold);
        // Top-right navy circle
        svg.append('circle').attr('cx', W - 32).attr('cy', 32)
            .attr('r', 14).attr('fill', navy);

        // ── SLOGAN: Bauhaus typography, appears in two beats ──
        var sloganG = svg.append('g');
        var cx = W / 2, cy = H * 0.38;

        // Line 1: "Automate what you do"
        var line1 = sloganG.append('text').attr('x', cx).attr('y', cy)
            .attr('text-anchor', 'middle')
            .attr('font-size', '48px').attr('font-weight', 800)
            .attr('fill', navy).attr('letter-spacing', '-1px')
            .style('font-family', 'Inter, Helvetica Neue, Arial, sans-serif')
            .style('opacity', 0)
            .text('Automate what you do,');

        // Line 2: "not do what is automated."
        var line2 = sloganG.append('text').attr('x', cx).attr('y', cy + 60)
            .attr('text-anchor', 'middle')
            .attr('font-size', '48px').attr('font-weight', 300)
            .attr('fill', slate).attr('letter-spacing', '-1px')
            .style('font-family', 'Inter, Helvetica Neue, Arial, sans-serif')
            .style('opacity', 0)
            .text('not do what is automated.');

        // Underline accent
        var underline = sloganG.append('line')
            .attr('x1', cx - 200).attr('y1', cy + 78)
            .attr('x2', cx - 200).attr('y2', cy + 78)
            .attr('stroke', red).attr('stroke-width', 3);

        // Beat 1: line 1 appears
        line1.transition().delay(300).duration(700)
            .style('opacity', 1);
        // Beat 2: line 2 appears
        line2.transition().delay(900).duration(700)
            .style('opacity', 1);
        // Beat 3: underline sweeps
        underline.transition().delay(1600).duration(600)
            .attr('x2', cx + 200);

        // ── ANIMATED NAV ARROWS: illustrate "you go left, you go right" ──
        var arrowY = H * 0.38;
        var arrowSize = 40;

        // Left chevron «
        var leftArrow = svg.append('g').style('opacity', 0);
        leftArrow.append('path')
            .attr('d', 'M' + (60 + arrowSize) + ',' + (arrowY - arrowSize) +
                        ' L60,' + arrowY +
                        ' L' + (60 + arrowSize) + ',' + (arrowY + arrowSize))
            .attr('fill', 'none').attr('stroke', red).attr('stroke-width', 4)
            .attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');
        leftArrow.append('text').attr('x', 62).attr('y', arrowY + arrowSize + 30)
            .attr('text-anchor', 'start').attr('font-size', '11px')
            .attr('fill', red).attr('font-weight', 600).attr('letter-spacing', '2px')
            .text('← PREV');

        // Right chevron »
        var rightArrow = svg.append('g').style('opacity', 0);
        rightArrow.append('path')
            .attr('d', 'M' + (W - 60 - arrowSize) + ',' + (arrowY - arrowSize) +
                        ' L' + (W - 60) + ',' + arrowY +
                        ' L' + (W - 60 - arrowSize) + ',' + (arrowY + arrowSize))
            .attr('fill', 'none').attr('stroke', navy).attr('stroke-width', 4)
            .attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');
        rightArrow.append('text').attr('x', W - 62).attr('y', arrowY + arrowSize + 30)
            .attr('text-anchor', 'end').attr('font-size', '11px')
            .attr('fill', navy).attr('font-weight', 600).attr('letter-spacing', '2px')
            .text('NEXT →');

        // Arrow animation: sweep in → hold → fade out → repeat
        function animateArrows() {
            // Left arrow sweeps in from off-screen
            leftArrow.attr('transform', 'translate(-80,0)').style('opacity', 0);
            leftArrow.transition().delay(2400).duration(500)
                .attr('transform', 'translate(0,0)').style('opacity', 0.9)
              .transition().duration(1200) // hold
              .transition().duration(500).style('opacity', 0);

            // Right arrow sweeps in from off-screen
            rightArrow.attr('transform', 'translate(80,0)').style('opacity', 0);
            rightArrow.transition().delay(2700).duration(500)
                .attr('transform', 'translate(0,0)').style('opacity', 0.9)
              .transition().duration(1200) // hold
              .transition().duration(500).style('opacity', 0);

            // "This is what you automate" label appears between the arrows
            autoLabel
                .style('opacity', 0)
                .transition().delay(3400).duration(400).style('opacity', 1)
                .transition().delay(1500).duration(600).style('opacity', 0);

            // Bottom nav bar highlights
            navHighlight
                .style('opacity', 0)
                .transition().delay(3800).duration(400).style('opacity', 1)
                .transition().delay(1200).duration(600).style('opacity', 0);

            // Repeat cycle
            setTimeout(animateArrows, 8000);
        }

        // ── "This is what you automate" annotation ──
        var autoLabel = svg.append('text')
            .attr('x', cx).attr('y', H * 0.62)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px').attr('font-weight', 600)
            .attr('fill', red).style('opacity', 0)
            .attr('letter-spacing', '3px')
            .text('THIS IS WHAT YOU AUTOMATE');

        // ── BOTTOM NAV BAR: represents slide navigation ──
        var navY = H - 70;
        var navW = 500, navH = 28;
        var navX = (W - navW) / 2;

        var navG = svg.append('g');

        // Nav bar background
        navG.append('rect').attr('x', navX).attr('y', navY)
            .attr('width', navW).attr('height', navH).attr('rx', 14)
            .attr('fill', '#e2e8f0');

        // Nav dots (representing slides)
        var dotCount = 15;
        var dotSpacing = navW / (dotCount + 1);
        for (var di = 0; di < dotCount; di++) {
            var dx = navX + dotSpacing * (di + 1);
            navG.append('circle').attr('cx', dx).attr('cy', navY + navH / 2)
                .attr('r', 4)
                .attr('fill', di === 3 ? navy : '#94a3b8');
        }

        // Nav label
        navG.append('text').attr('x', cx).attr('y', navY + navH + 18)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', slate).attr('letter-spacing', '1px')
            .text('SLIDE NAVIGATION');

        // Nav highlight ring (animated)
        var navHighlight = svg.append('rect')
            .attr('x', navX - 6).attr('y', navY - 6)
            .attr('width', navW + 12).attr('height', navH + 12).attr('rx', 18)
            .attr('fill', 'none').attr('stroke', gold).attr('stroke-width', 3)
            .style('opacity', 0);

        // ── Bauhaus rule line at bottom ──
        svg.append('line').attr('x1', 18).attr('y1', H - 30)
            .attr('x2', W - 18).attr('y2', H - 30)
            .attr('stroke', navy).attr('stroke-width', 1).attr('stroke-opacity', 0.3);

        // ── Subtitle line ──
        svg.append('text').attr('x', cx).attr('y', H - 12)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', slate).attr('font-style', 'italic');

        // Start the arrow animation loop
        animateArrows();
    }


    // ─── ARCHITECTURAL JUDGMENT (scaling fork) ─────────────────
    function architecturalJudgment(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent bg for test harness
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var cx = W / 2;

        // ── Colors ──
        var green = '#065f46';
        var greenLight = '#ecfdf5';
        var red = '#991b1b';
        var redLight = '#fef2f2';
        var slate = '#374151';
        var darkText = '#1f2937';

        // ── Geometry: Y-fork from bottom center ──
        var stemBaseY = H - 70;
        var forkY = 340;
        var stemW = 64;

        // Left branch (precise intent) — stays narrow
        var leftEndX = cx - 260;
        var leftEndY = 100;
        var leftW = 56;

        // Right branch (vague intent) — widens dramatically
        var rightEndX = cx + 260;
        var rightEndY = 100;
        var rightWEnd = 200;

        // ── Top annotation ──
        svg.append('text')
            .attr('x', cx).attr('y', 28)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#6b7280').attr('letter-spacing', '1.5px')
            .text('PRECISION OF THOUGHT');

        // ── Draw stem (layer 1 — back) ──
        svg.append('polygon')
            .attr('points',
                (cx - stemW / 2) + ',' + stemBaseY + ' ' +
                (cx + stemW / 2) + ',' + stemBaseY + ' ' +
                (cx + stemW / 2) + ',' + forkY + ' ' +
                (cx - stemW / 2) + ',' + forkY)
            .attr('fill', '#e5e7eb').attr('stroke', slate)
            .attr('stroke-width', 1.5);

        // ── LEFT BRANCH (layer 2) ──
        var lx1 = cx - stemW / 2;
        var lx2 = cx - 4;
        svg.append('polygon')
            .attr('points',
                lx1 + ',' + forkY + ' ' +
                lx2 + ',' + forkY + ' ' +
                (leftEndX + leftW / 2) + ',' + leftEndY + ' ' +
                (leftEndX - leftW / 2) + ',' + leftEndY)
            .attr('fill', greenLight)
            .attr('stroke', green).attr('stroke-width', 1.5);

        // ── RIGHT BRANCH (layer 2) ──
        var rx1 = cx + 4;
        var rx2 = cx + stemW / 2;
        svg.append('polygon')
            .attr('points',
                rx1 + ',' + forkY + ' ' +
                rx2 + ',' + forkY + ' ' +
                (rightEndX + rightWEnd / 2) + ',' + rightEndY + ' ' +
                (rightEndX - rightWEnd / 2) + ',' + rightEndY)
            .attr('fill', redLight)
            .attr('stroke', red).attr('stroke-width', 1.5);

        // ══════ ALL LABELS DRAWN LAST (layer 3 — on top) ══════

        // ── Stem label ──
        svg.append('text')
            .attr('x', cx).attr('y', stemBaseY + 24)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', darkText)
            .text('AI-Accelerated Implementation');

        svg.append('text')
            .attr('x', cx).attr('y', stemBaseY + 42)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#4b5563').attr('font-style', 'italic')
            .text('Same speed. Same power. Either path.');

        // ── Fork point (drawn ON TOP of branches) ──
        // White backing to clear the overlapping branch edges
        svg.append('circle')
            .attr('cx', cx).attr('cy', forkY)
            .attr('r', 18)
            .attr('fill', 'white');

        svg.append('circle')
            .attr('cx', cx).attr('cy', forkY)
            .attr('r', 16)
            .attr('fill', '#f3f4f6')
            .attr('stroke', slate).attr('stroke-width', 2);

        // "DECISION POINT" inside the circle area, clearly visible
        svg.append('text')
            .attr('x', cx).attr('y', forkY - 24)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', darkText)
            .attr('letter-spacing', '1.5px');

        // Arrow-down hint inside circle
        svg.append('text')
            .attr('x', cx).attr('y', forkY + 5)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', slate)
            .text('\u25B2'); // upward triangle (fork goes up)

        // ── Left branch labels ──
        svg.append('text')
            .attr('x', leftEndX).attr('y', leftEndY - 20)
            .attr('text-anchor', 'middle').attr('font-size', '16px')
            .attr('font-weight', '700').attr('fill', green)
            .text('Clear Intent');

        // Annotations along left branch — positioned outside the shape
        var leftAnnotX = leftEndX - leftW / 2 - 16;
        var leftMidY = (forkY + leftEndY) / 2 - 10;

        svg.append('text')
            .attr('x', leftAnnotX).attr('y', leftMidY - 20)
            .attr('text-anchor', 'end').attr('font-size', '12px')
            .attr('fill', green).attr('font-weight', '600')
            .text('Right abstraction');
        svg.append('text')
            .attr('x', leftAnnotX).attr('y', leftMidY)
            .attr('text-anchor', 'end').attr('font-size', '12px')
            .attr('fill', green).attr('font-weight', '600')
            .text('Right data model');
        svg.append('text')
            .attr('x', leftAnnotX).attr('y', leftMidY + 20)
            .attr('text-anchor', 'end').attr('font-size', '12px')
            .attr('fill', green).attr('font-weight', '600')
            .text('Right decomposition');

        // Left outcome
        svg.append('rect')
            .attr('x', leftEndX - 90).attr('y', leftEndY - 8)
            .attr('width', 180).attr('height', 3)
            .attr('fill', green).attr('fill-opacity', 0.3);

        svg.append('text')
            .attr('x', leftEndX).attr('y', leftEndY + 18)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', green).attr('font-weight', '600');

        // ── Right branch labels ──
        svg.append('text')
            .attr('x', rightEndX).attr('y', rightEndY - 20)
            .attr('text-anchor', 'middle').attr('font-size', '16px')
            .attr('font-weight', '700').attr('fill', red)
            .text('Vague Intent');

        // Annotations along right branch — positioned outside the shape
        var rightAnnotX = rightEndX + rightWEnd / 2 + 16;
        var rightMidY = (forkY + rightEndY) / 2 - 10;

        svg.append('text')
            .attr('x', rightAnnotX).attr('y', rightMidY - 20)
            .attr('font-size', '12px')
            .attr('fill', red).attr('font-weight', '600')
            .text('Working code');
        svg.append('text')
            .attr('x', rightAnnotX).attr('y', rightMidY)
            .attr('font-size', '12px')
            .attr('fill', red).attr('font-weight', '600')
            .text('Wrong system');
        svg.append('text')
            .attr('x', rightAnnotX).attr('y', rightMidY + 20)
            .attr('font-size', '12px')
            .attr('fill', red).attr('font-weight', '600')
            .text('Scaled cost');

        // Width annotation on right branch
        var annY = rightEndY + 8;
        svg.append('line')
            .attr('x1', rightEndX - rightWEnd / 2)
            .attr('y1', annY)
            .attr('x2', rightEndX + rightWEnd / 2)
            .attr('y2', annY)
            .attr('stroke', red).attr('stroke-width', 1)
            .attr('stroke-opacity', 0.5);

        svg.append('text')
            .attr('x', rightEndX).attr('y', annY + 18)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', red).attr('font-weight', '600')
            .text('Cost expands');

        // Width comparison on left branch
        svg.append('line')
            .attr('x1', leftEndX - leftW / 2).attr('y1', leftEndY + 8)
            .attr('x2', leftEndX + leftW / 2).attr('y2', leftEndY + 8)
            .attr('stroke', green).attr('stroke-width', 1)
            .attr('stroke-opacity', 0.5);

        // ── Center insight (between fork and stem) ──
        svg.append('text')
            .attr('x', cx).attr('y', forkY + 46)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', darkText).attr('font-style', 'italic');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── TACIT KNOWLEDGE (transfer boundary) ───────────────────
    function tacitKnowledge(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent bg for test harness
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var darkText = '#1f2937';

        // ── Layout ──
        var leftMargin = 50;
        var zoneW = 720;
        var boundaryY = 260;
        var topZoneY = 56;
        var botZoneY = boundaryY + 4;
        var botZoneH = 210;
        var topZoneH = boundaryY - topZoneY - 4;

        // Expert bridge on the right
        var bridgeX = leftMargin + zoneW + 50;
        var bridgeW = 170;

        // ── Top zone background (codified — AI accessible) ──
        svg.append('rect')
            .attr('x', leftMargin).attr('y', topZoneY)
            .attr('width', zoneW).attr('height', topZoneH)
            .attr('rx', 4)
            .attr('fill', '#ecfdf5')
            .attr('stroke', '#065f46').attr('stroke-width', 1)
            .attr('stroke-opacity', 0.25);

        // Top zone header
        svg.append('text')
            .attr('x', leftMargin + 16).attr('y', topZoneY + 26)
            .attr('font-size', '15px').attr('font-weight', '700')
            .attr('fill', '#065f46').attr('letter-spacing', '1px')
            .text('CODIFIED KNOWLEDGE');

        svg.append('text')
            .attr('x', leftMargin + 16).attr('y', topZoneY + 46)
            .attr('font-size', '13px')
            .attr('fill', '#065f46')
            .text('AI can use this');

        // Codified items
        var codified = [
            { label: 'Rules & Policies', x: 100, y: 100 },
            { label: 'Dictionaries & Ontologies', x: 360, y: 90 },
            { label: 'Interface Specifications', x: 140, y: 160 },
            { label: 'Historical Examples', x: 420, y: 155 },
            { label: 'Documentation', x: 600, y: 110 },
            { label: 'Code & APIs', x: 580, y: 170 }
        ];

        codified.forEach(function (item) {
            // Dot
            svg.append('circle')
                .attr('cx', leftMargin + item.x).attr('cy', topZoneY + item.y - 30)
                .attr('r', 5)
                .attr('fill', '#065f46').attr('fill-opacity', 0.7);
            // Label
            svg.append('text')
                .attr('x', leftMargin + item.x + 12)
                .attr('y', topZoneY + item.y - 25)
                .attr('font-size', '14px').attr('font-weight', '600')
                .attr('fill', '#1f2937')
                .text(item.label);
        });

        // ── Bottom zone background (tacit — AI inaccessible) ──
        // Drawn BEFORE boundary so boundary renders on top
        svg.append('rect')
            .attr('x', leftMargin).attr('y', botZoneY)
            .attr('width', zoneW).attr('height', botZoneH)
            .attr('rx', 4)
            .attr('fill', '#fef2f2')
            .attr('stroke', '#991b1b').attr('stroke-width', 1)
            .attr('stroke-opacity', 0.25);

        // Bottom zone header
        svg.append('text')
            .attr('x', leftMargin + 16).attr('y', botZoneY + 26)
            .attr('font-size', '15px').attr('font-weight', '700')
            .attr('fill', '#991b1b').attr('letter-spacing', '1px')
            .text('TACIT KNOWLEDGE');

        svg.append('text')
            .attr('x', leftMargin + 16).attr('y', botZoneY + 46)
            .attr('font-size', '13px')
            .attr('fill', '#991b1b')
            .text('AI cannot inherit this');

        // Tacit items
        var tacit = [
            { label: 'Lived experience', x: 100, y: 80 },
            { label: 'Tacit judgment', x: 360, y: 72 },
            { label: 'Local workflow reality', x: 140, y: 140 },
            { label: 'Institutional memory', x: 420, y: 135 },
            { label: 'Which ambiguity is dangerous', x: 240, y: 180 },
            { label: 'When correct is wrong', x: 550, y: 100 }
        ];

        tacit.forEach(function (item) {
            // Hollow dot (tacit = not capturable)
            svg.append('circle')
                .attr('cx', leftMargin + item.x).attr('cy', botZoneY + item.y - 20)
                .attr('r', 5)
                .attr('fill', 'none')
                .attr('stroke', '#991b1b').attr('stroke-width', 2.5);
            // Label
            svg.append('text')
                .attr('x', leftMargin + item.x + 12)
                .attr('y', botZoneY + item.y - 15)
                .attr('font-size', '14px').attr('font-weight', '600')
                .attr('fill', '#1f2937')
                .text(item.label);
        });

        // ── TRANSFER BOUNDARY LINE (drawn after both zones so it's on top) ──
        svg.append('line')
            .attr('x1', leftMargin - 10).attr('y1', boundaryY)
            .attr('x2', leftMargin + zoneW + 10).attr('y2', boundaryY)
            .attr('stroke', '#dc2626').attr('stroke-width', 3);

        // Boundary label — white backing with generous padding
        var boundaryLabelX = leftMargin + zoneW / 2;
        svg.append('rect')
            .attr('x', boundaryLabelX - 130).attr('y', boundaryY - 16)
            .attr('width', 260).attr('height', 32)
            .attr('rx', 4).attr('fill', 'white')
            .attr('stroke', '#dc2626').attr('stroke-width', 1).attr('stroke-opacity', 0.3);

        svg.append('text')
            .attr('x', boundaryLabelX).attr('y', boundaryY + 8)
            .attr('text-anchor', 'middle').attr('font-size', '16px')
            .attr('font-weight', '700').attr('fill', '#dc2626')
            .attr('letter-spacing', '2.5px')
            .text('TRANSFER BOUNDARY');

        // ── EXPERT BRIDGE (right side, spanning both zones) ──
        var bridgeTop = topZoneY + 20;
        var bridgeBot = botZoneY + botZoneH - 20;
        var bridgeCx = bridgeX + bridgeW / 2;

        // Vertical bridge rect
        svg.append('rect')
            .attr('x', bridgeX).attr('y', bridgeTop)
            .attr('width', bridgeW).attr('height', bridgeBot - bridgeTop)
            .attr('rx', 4)
            .attr('fill', '#eff6ff')
            .attr('stroke', '#1e3a5f').attr('stroke-width', 2);

        // Bridge header
        svg.append('text')
            .attr('x', bridgeCx).attr('y', bridgeTop + 28)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', '#1e3a5f')
            .attr('letter-spacing', '1.5px')
            .text('THE EXPERT');

        // Bridge subtitle
        svg.append('text')
            .attr('x', bridgeCx).attr('y', bridgeTop + 46)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#4b5563').attr('font-style', 'italic')
            .text('spans both zones');

        // Divider inside bridge
        svg.append('line')
            .attr('x1', bridgeX + 16).attr('y1', bridgeTop + 58)
            .attr('x2', bridgeX + bridgeW - 16).attr('y2', bridgeTop + 58)
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1).attr('stroke-opacity', 0.2);

        // Expert roles
        var roles = [
            { label: 'Formalize', desc: 'what can be codified', y: bridgeTop + 86 },
            { label: 'Supervise', desc: 'what AI produces', y: bridgeTop + 140 },
            { label: 'Interpret', desc: 'what context demands', y: bridgeTop + 194 }
        ];

        roles.forEach(function (role) {
            svg.append('text')
                .attr('x', bridgeCx).attr('y', role.y)
                .attr('text-anchor', 'middle').attr('font-size', '16px')
                .attr('font-weight', '700').attr('fill', '#1e3a5f')
                .text(role.label);

            svg.append('text')
                .attr('x', bridgeCx).attr('y', role.y + 20)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('fill', '#374151')
                .text(role.desc);
        });

        // Arrows from bridge into both zones
        // Arrow into top zone
        svg.append('line')
            .attr('x1', bridgeX).attr('y1', bridgeTop + 80)
            .attr('x2', leftMargin + zoneW + 6).attr('y2', bridgeTop + 80)
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '4,3');

        // Arrow into bottom zone
        svg.append('line')
            .attr('x1', bridgeX).attr('y1', botZoneY + 80)
            .attr('x2', leftMargin + zoneW + 6).attr('y2', botZoneY + 80)
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '4,3');

        // ── Top title ──
        svg.append('text')
            .attr('x', W / 2).attr('y', 30)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#374151').attr('font-weight', '700')
            .attr('letter-spacing', '2px')
            .text('TACIT KNOWLEDGE DOES NOT TRANSFER CLEANLY');

        // ── Bottom takeaway ──
        svg.append('text')
            .attr('x', W / 2).attr('y', H - 28)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', darkText).attr('font-style', 'italic')
            .text('AI amplifies expertise.');

        svg.append('text')
            .attr('x', W / 2).attr('y', H - 8)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', darkText).attr('font-weight', '700')
            .text('The gap is qualitative.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── WRONG QUESTION (typographic pivot) ────────────────────
    function wrongQuestion(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var cx = W / 2;
        var darkText = '#1f2937';

        // ══════════════════════════════════════════════
        // UPPER ZONE — The wrong question (faded, struck)
        // ══════════════════════════════════════════════

        // Subtle background tint for wrong-question zone
        svg.append('rect')
            .attr('x', 60).attr('y', 30)
            .attr('width', W - 120).attr('height', 160)
            .attr('rx', 4)
            .attr('fill', '#fef2f2');

        // "Most conversations about AI ask:"
        svg.append('text')
            .attr('x', cx).attr('y', 72)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#6b7280')
            .text('Most conversations about AI-assisted development ask:');

        // The wrong question — large, struck through
        var wrongY = 128;
        svg.append('text')
            .attr('x', cx).attr('y', wrongY)
            .attr('text-anchor', 'middle').attr('font-size', '32px')
            .attr('font-weight', '300').attr('fill', '#991b1b')
            .attr('fill-opacity', 0.4)
            .attr('font-style', 'italic')
            .text('\u201CWhat can AI build?\u201D');

        // Strikethrough line across the wrong question
        var strikeW = 360;
        svg.append('line')
            .attr('x1', cx - strikeW / 2).attr('y1', wrongY - 8)
            .attr('x2', cx + strikeW / 2).attr('y2', wrongY - 8)
            .attr('stroke', '#991b1b').attr('stroke-width', 2.5)
            .attr('stroke-opacity', 0.5);

        // "That is the wrong question." label
        svg.append('text')
            .attr('x', cx).attr('y', 170)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '600').attr('fill', '#991b1b')
            .attr('letter-spacing', '2px')
            .text('THAT IS THE WRONG QUESTION');

        // ══════════════════════════════════════════════
        // GEOMETRIC PIVOT — Bauhaus divider
        // ══════════════════════════════════════════════

        var pivotY = 214;

        // Horizontal rule
        svg.append('line')
            .attr('x1', 100).attr('y1', pivotY)
            .attr('x2', cx - 18).attr('y2', pivotY)
            .attr('stroke', darkText).attr('stroke-width', 2).attr('stroke-opacity', 0.3);

        svg.append('line')
            .attr('x1', cx + 18).attr('y1', pivotY)
            .attr('x2', W - 100).attr('y2', pivotY)
            .attr('stroke', darkText).attr('stroke-width', 2).attr('stroke-opacity', 0.3);

        // Central diamond pivot marker
        svg.append('rect')
            .attr('x', cx - 8).attr('y', pivotY - 8)
            .attr('width', 16).attr('height', 16)
            .attr('fill', darkText)
            .attr('transform', 'rotate(45,' + cx + ',' + pivotY + ')');

        // ══════════════════════════════════════════════
        // LOWER ZONE — The right question (bold, present)
        // ══════════════════════════════════════════════

        // Subtle background tint for right-question zone
        svg.append('rect')
            .attr('x', 60).attr('y', 240)
            .attr('width', W - 120).attr('height', 130)
            .attr('rx', 4)
            .attr('fill', '#ecfdf5');

        // "The useful question:"
        svg.append('text')
            .attr('x', cx).attr('y', 274)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#065f46')
            .text('The useful question:');

        // The right question — large, bold, full weight
        svg.append('text')
            .attr('x', cx).attr('y', 324)
            .attr('text-anchor', 'middle').attr('font-size', '28px')
            .attr('font-weight', '700').attr('fill', '#065f46')
            .text('\u201CWhat does AI change about the act of building?\u201D');

        // Underline emphasis
        var underW = 560;
        svg.append('line')
            .attr('x1', cx - underW / 2).attr('y1', 336)
            .attr('x2', cx + underW / 2).attr('y2', 336)
            .attr('stroke', '#065f46').attr('stroke-width', 2)
            .attr('stroke-opacity', 0.25);

        // ══════════════════════════════════════════════
        // TAKEAWAY — anchoring the bottom
        // ══════════════════════════════════════════════

        // Divider
        svg.append('line')
            .attr('x1', 160).attr('y1', 400)
            .attr('x2', W - 160).attr('y2', 400)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.15);

        // Takeaway
        svg.append('text')
            .attr('x', cx).attr('y', 436)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('fill', darkText).attr('font-weight', '600')
            .text('The capability is not the transformation.');

        svg.append('text')
            .attr('x', cx).attr('y', 460)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('fill', darkText).attr('font-weight', '600')
            .text('The transformation is what changes in the practice of building.');

        // Comment / expanded blob
        svg.append('text')
            .attr('x', cx).attr('y', 500)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('Let\u2019s try to recalibrate our thinking about the role of AI in development.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── SYLLABIC MIXING (cross-domain discovery) ─────────────
    function syllabicMixing(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var darkText = '#1f2937';
        var cx = W / 2;

        // ── Top title ──
        svg.append('text')
            .attr('x', cx).attr('y', 26)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#374151').attr('font-weight', '700')
            .attr('letter-spacing', '2px')
            .text('SYLLABIC MIXING \u2014 AI AS CROSS-DOMAIN CONSULTANT');

        // ── Seven language sources ──
        var languages = [
            { name: 'Finnish', rule: 'Vowel harmony', color: '#1e3a5f' },
            { name: 'Georgian', rule: 'Consonant clusters', color: '#5b21b6' },
            { name: 'Yoruba', rule: 'Tonal patterns', color: '#065f46' },
            { name: 'Japanese', rule: 'CV syllables', color: '#991b1b' },
            { name: 'Welsh', rule: 'Mutation rules', color: '#92400e' },
            { name: 'Swahili', rule: 'Agglutination', color: '#0e7490' },
            { name: 'Hungarian', rule: 'Stress patterns', color: '#7c3aed' }
        ];

        var blockW = 110, blockH = 70;
        var langGap = 18;
        var totalLangW = languages.length * blockW + (languages.length - 1) * langGap;
        var langStartX = (W - totalLangW) / 2;
        var langY = 50;

        languages.forEach(function (lang, i) {
            var bx = langStartX + i * (blockW + langGap);
            var bCx = bx + blockW / 2;

            // Block
            svg.append('rect')
                .attr('x', bx).attr('y', langY)
                .attr('width', blockW).attr('height', blockH)
                .attr('rx', 3)
                .attr('fill', lang.color).attr('fill-opacity', 0.08)
                .attr('stroke', lang.color).attr('stroke-width', 1.5);

            // Top color accent bar
            svg.append('rect')
                .attr('x', bx).attr('y', langY)
                .attr('width', blockW).attr('height', 4)
                .attr('rx', 2).attr('fill', lang.color);
            svg.append('rect')
                .attr('x', bx).attr('y', langY + 2)
                .attr('width', blockW).attr('height', 2)
                .attr('fill', lang.color);

            // Language name
            svg.append('text')
                .attr('x', bCx).attr('y', langY + 30)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('font-weight', '700').attr('fill', lang.color)
                .text(lang.name);

            // Rule
            svg.append('text')
                .attr('x', bCx).attr('y', langY + 48)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#4b5563')
                .text(lang.rule);

            // Convergence line down to mixing zone
            svg.append('line')
                .attr('x1', bCx).attr('y1', langY + blockH)
                .attr('x2', cx).attr('y2', 200)
                .attr('stroke', lang.color).attr('stroke-width', 1.5)
                .attr('stroke-opacity', 0.3)
                .attr('stroke-dasharray', '4,3');
        });

        // ── Mixing zone (central) ──
        var mixY = 190, mixH = 70, mixW = 360;
        var mixX = cx - mixW / 2;

        svg.append('rect')
            .attr('x', mixX).attr('y', mixY)
            .attr('width', mixW).attr('height', mixH)
            .attr('rx', 6)
            .attr('fill', '#f8fafc')
            .attr('stroke', '#374151').attr('stroke-width', 2);

        svg.append('text')
            .attr('x', cx).attr('y', mixY + 28)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', '700').attr('fill', darkText)
            .text('Syllabic Mixing Engine');

        svg.append('text')
            .attr('x', cx).attr('y', mixY + 48)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#4b5563')
            .text('Combine phonemic blocks according to each language\u2019s rules');

        // ── Arrow down from mixing zone ──
        var arrowTopY = mixY + mixH + 6;
        var arrowBotY = arrowTopY + 30;
        svg.append('line')
            .attr('x1', cx).attr('y1', arrowTopY)
            .attr('x2', cx).attr('y2', arrowBotY)
            .attr('stroke', '#374151').attr('stroke-width', 2);
        svg.append('polygon')
            .attr('points',
                cx + ',' + (arrowBotY + 2) + ' ' +
                (cx - 5) + ',' + (arrowBotY - 6) + ' ' +
                (cx + 5) + ',' + (arrowBotY - 6))
            .attr('fill', '#374151');

        // ── Two-axis outcome diagram ──
        var chartX = 160, chartY = 310, chartW = 340, chartH = 180;

        // Background
        svg.append('rect')
            .attr('x', chartX).attr('y', chartY)
            .attr('width', chartW).attr('height', chartH)
            .attr('fill', '#f9fafb')
            .attr('stroke', '#e5e7eb').attr('stroke-width', 1);

        // Quadrant shading — top-left is the sweet spot
        svg.append('rect')
            .attr('x', chartX).attr('y', chartY)
            .attr('width', chartW / 2).attr('height', chartH / 2)
            .attr('fill', '#065f46').attr('fill-opacity', 0.06);

        // Y-axis: "Is a real name" (bottom=low, top=high)
        svg.append('line')
            .attr('x1', chartX).attr('y1', chartY)
            .attr('x2', chartX).attr('y2', chartY + chartH)
            .attr('stroke', '#374151').attr('stroke-width', 1.5);

        svg.append('text')
            .attr('x', chartX - 10).attr('y', chartY + 8)
            .attr('text-anchor', 'end').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .text('High');
        svg.append('text')
            .attr('x', chartX - 10).attr('y', chartY + chartH)
            .attr('text-anchor', 'end').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .text('Low');

        // Y-axis label (rotated)
        svg.append('text')
            .attr('x', chartX - 42).attr('y', chartY + chartH / 2)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .attr('transform', 'rotate(-90,' + (chartX - 42) + ',' + (chartY + chartH / 2) + ')')
            .text('Sounds like a name');

        // X-axis: "Sounds like a name" (left=low, right=high)
        svg.append('line')
            .attr('x1', chartX).attr('y1', chartY + chartH)
            .attr('x2', chartX + chartW).attr('y2', chartY + chartH)
            .attr('stroke', '#374151').attr('stroke-width', 1.5);

        svg.append('text')
            .attr('x', chartX).attr('y', chartY + chartH + 18)
            .attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .text('Low');
        svg.append('text')
            .attr('x', chartX + chartW).attr('y', chartY + chartH + 18)
            .attr('text-anchor', 'end').attr('font-size', '11px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .text('High');

        // X-axis label
        svg.append('text')
            .attr('x', chartX + chartW / 2).attr('y', chartY + chartH + 34)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', '#374151').attr('font-weight', '600')
            .text('Is a real name');

        // ── Data point: syllabic mixing output (top-left sweet spot) ──
        var dotX = chartX + chartW * 0.18;
        var dotY = chartY + chartH * 0.15;

        svg.append('circle')
            .attr('cx', dotX).attr('cy', dotY).attr('r', 10)
            .attr('fill', '#065f46').attr('fill-opacity', 0.2)
            .attr('stroke', '#065f46').attr('stroke-width', 2.5);

        svg.append('text')
            .attr('x', dotX + 18).attr('y', dotY + 4)
            .attr('font-size', '13px').attr('font-weight', '700')
            .attr('fill', '#065f46')
            .text('Syllabic mixing output');

        svg.append('text')
            .attr('x', dotX + 18).attr('y', dotY + 20)
            .attr('font-size', '11px')
            .attr('fill', '#4b5563').attr('font-style', 'italic')
            .text('Sounds real, isn\u2019t real');

        // ── Quadrant labels ──
        svg.append('text')
            .attr('x', chartX + chartW * 0.75).attr('y', chartY + chartH * 0.2)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#6b7280')
            .text('Real names');

        svg.append('text')
            .attr('x', chartX + chartW * 0.75).attr('y', chartY + chartH * 0.8)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#6b7280')
            .text('Random strings');

        // ── Right side: cross-domain insight panel ──
        var panelX = 580, panelY = 310, panelW = 420, panelH = 180;

        svg.append('rect')
            .attr('x', panelX).attr('y', panelY)
            .attr('width', panelW).attr('height', panelH)
            .attr('rx', 4)
            .attr('fill', '#eff6ff')
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1.5);

        // Panel header
        svg.append('text')
            .attr('x', panelX + panelW / 2).attr('y', panelY + 26)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', '#1e3a5f')
            .attr('letter-spacing', '1px')
            .text('THE CROSS-DOMAIN MOMENT');

        svg.append('line')
            .attr('x1', panelX + 20).attr('y1', panelY + 38)
            .attr('x2', panelX + panelW - 20).attr('y2', panelY + 38)
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1).attr('stroke-opacity', 0.2);

        // User's domain
        svg.append('text')
            .attr('x', panelX + 20).attr('y', panelY + 60)
            .attr('font-size', '12px').attr('font-weight', '600')
            .attr('fill', '#991b1b')
            .text('Your domain:');
        svg.append('text')
            .attr('x', panelX + 110).attr('y', panelY + 60)
            .attr('font-size', '12px')
            .attr('fill', '#374151')
            .text('Software / Pathology Informatics');

        // Arrow
        svg.append('text')
            .attr('x', panelX + panelW / 2).attr('y', panelY + 84)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#374151')
            .text('\u2193  AI surfaces approach from  \u2193');

        // Solution domain
        svg.append('text')
            .attr('x', panelX + 20).attr('y', panelY + 108)
            .attr('font-size', '12px').attr('font-weight', '600')
            .attr('fill', '#065f46')
            .text('Found field:');
        svg.append('text')
            .attr('x', panelX + 110).attr('y', panelY + 108)
            .attr('font-size', '12px')
            .attr('fill', '#374151')
            .text('Computational Linguistics');

        // Divider
        svg.append('line')
            .attr('x1', panelX + 20).attr('y1', panelY + 122)
            .attr('x2', panelX + panelW - 20).attr('y2', panelY + 122)
            .attr('stroke', '#1e3a5f').attr('stroke-width', 1).attr('stroke-opacity', 0.15);

        // Key insight
        svg.append('text')
            .attr('x', panelX + panelW / 2).attr('y', panelY + 148)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', '#1e3a5f')
            .text('The model didn\u2019t just write the code.');

        svg.append('text')
            .attr('x', panelX + panelW / 2).attr('y', panelY + 168)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', '#1e3a5f')
            .text('It found the field.');

        // ── Bottom takeaway ──
        svg.append('text')
            .attr('x', cx).attr('y', H - 12)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', darkText).attr('font-style', 'italic')
            .text('I described the constraint. The model surfaced an approach from linguistics I would not have reached independently.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── EVALUATION COST (option space expansion) ─────────────
    function evaluationCost(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent bg for test harness
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        // ── Layout: two zones separated by a transition arrow ──
        var leftCx = 220, rightCx = 740;
        var baseY = 260;

        // ── LEFT: Old option space (small, thick wall) ──
        var oldSize = 190;
        var wallThick = 14;

        // Thick wall (outer rect)
        svg.append('rect')
            .attr('x', leftCx - oldSize / 2 - wallThick)
            .attr('y', baseY - oldSize / 2 - wallThick)
            .attr('width', oldSize + wallThick * 2)
            .attr('height', oldSize + wallThick * 2)
            .attr('rx', 3)
            .attr('fill', '#991b1b').attr('fill-opacity', 0.12);

        // Inner space
        svg.append('rect')
            .attr('x', leftCx - oldSize / 2)
            .attr('y', baseY - oldSize / 2)
            .attr('width', oldSize).attr('height', oldSize)
            .attr('rx', 2)
            .attr('fill', '#fef2f2')
            .attr('stroke', '#991b1b').attr('stroke-width', wallThick)
            .attr('stroke-opacity', 0.35);

        // Label: "What you already knew"
        svg.append('text')
            .attr('x', leftCx).attr('y', baseY - 14)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', '#991b1b')
            .text('What you');
        svg.append('text')
            .attr('x', leftCx).attr('y', baseY + 6)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', '#991b1b')
            .text('already knew');

        // Wall annotation (left side)
        var wallLabelX = leftCx - oldSize / 2 - wallThick - 6;
        svg.append('text')
            .attr('x', wallLabelX).attr('y', baseY - 30)
            .attr('text-anchor', 'end').attr('font-size', '9px')
            .attr('font-weight', '600').attr('fill', '#991b1b')
            .attr('letter-spacing', '0.5px')
            .text('EVALUATION');
        svg.append('text')
            .attr('x', wallLabelX).attr('y', baseY - 19)
            .attr('text-anchor', 'end').attr('font-size', '9px')
            .attr('font-weight', '600').attr('fill', '#991b1b')
            .attr('letter-spacing', '0.5px')
            .text('TAX');

        // Wall cost details
        var costY = baseY + 16;
        var costs = ['Days of setup', 'Documentation', 'A colleague who knew it'];
        costs.forEach(function (c, i) {
            svg.append('text')
                .attr('x', wallLabelX).attr('y', costY + i * 14)
                .attr('text-anchor', 'end').attr('font-size', '9px')
                .attr('fill', '#6b7280')
                .text(c);
        });

        // ── TRANSITION ARROW ──
        var arrowY = baseY;
        var arrowX1 = leftCx + oldSize / 2 + wallThick + 24;
        var arrowX2 = rightCx - 200;

        svg.append('line')
            .attr('x1', arrowX1).attr('y1', arrowY)
            .attr('x2', arrowX2).attr('y2', arrowY)
            .attr('stroke', '#374151').attr('stroke-width', 2);

        // Arrowhead
        svg.append('polygon')
            .attr('points',
                arrowX2 + ',' + arrowY + ' ' +
                (arrowX2 - 10) + ',' + (arrowY - 5) + ' ' +
                (arrowX2 - 10) + ',' + (arrowY + 5))
            .attr('fill', '#374151');

        // Arrow label
        svg.append('text')
            .attr('x', (arrowX1 + arrowX2) / 2).attr('y', arrowY - 14)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-weight', '600').attr('fill', '#374151')
            .text('AI + Docker');

        svg.append('text')
            .attr('x', (arrowX1 + arrowX2) / 2).attr('y', arrowY + 22)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('hours, sometimes minutes');

        // ── RIGHT: New option space (large, thin border) ──
        var newSize = 360;
        var thinBorder = 1.5;

        svg.append('rect')
            .attr('x', rightCx - newSize / 2)
            .attr('y', baseY - newSize / 2)
            .attr('width', newSize).attr('height', newSize)
            .attr('rx', 2)
            .attr('fill', '#ecfdf5')
            .attr('stroke', '#065f46').attr('stroke-width', thinBorder);

        // Ghost of old space inside (proportional comparison)
        svg.append('rect')
            .attr('x', rightCx - oldSize / 2)
            .attr('y', baseY - oldSize / 2)
            .attr('width', oldSize).attr('height', oldSize)
            .attr('rx', 2)
            .attr('fill', 'none')
            .attr('stroke', '#991b1b').attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4').attr('stroke-opacity', 0.4);

        // Ghost label
        svg.append('text')
            .attr('x', rightCx + oldSize / 2 + 6).attr('y', baseY + 4)
            .attr('font-size', '9px')
            .attr('fill', '#991b1b').attr('fill-opacity', 0.5)
            .attr('font-style', 'italic')
            .text('old boundary');

        // Label: "What actually exists"
        svg.append('text')
            .attr('x', rightCx).attr('y', baseY - newSize / 2 + 36)
            .attr('text-anchor', 'middle').attr('font-size', '16px')
            .attr('font-weight', '700').attr('fill', '#065f46')
            .text('What actually exists');

        // Expansion items in the new space (outside old boundary)
        var items = [
            { label: 'Unfamiliar stacks', x: rightCx - 140, y: baseY + 120 },
            { label: 'Alternative architectures', x: rightCx + 80, y: baseY + 130 },
            { label: 'New integrations', x: rightCx - 120, y: baseY - 120 },
            { label: 'Unexplored frameworks', x: rightCx + 100, y: baseY - 110 }
        ];

        items.forEach(function (item) {
            svg.append('circle')
                .attr('cx', item.x).attr('cy', item.y).attr('r', 3)
                .attr('fill', '#065f46').attr('fill-opacity', 0.5);
            svg.append('text')
                .attr('x', item.x + 8).attr('y', item.y + 4)
                .attr('font-size', '10px')
                .attr('fill', '#374151')
                .text(item.label);
        });

        // ── Area ratio annotation ──
        var ratio = Math.round((newSize * newSize) / (oldSize * oldSize) * 10) / 10;
        svg.append('text')
            .attr('x', rightCx).attr('y', baseY + newSize / 2 - 14)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#065f46').attr('font-weight', '600')
            .text(ratio + '\u00d7 the explorable space');

        // ── Top annotation ──
        svg.append('text')
            .attr('x', W / 2).attr('y', 24)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280').attr('letter-spacing', '1.5px')
            .text('THE OPTION SPACE BEFORE AND AFTER');

        // ── Column headers ──
        svg.append('text')
            .attr('x', leftCx).attr('y', baseY - oldSize / 2 - wallThick - 20)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', '#991b1b')
            .text('Before');

        svg.append('text')
            .attr('x', rightCx).attr('y', baseY - newSize / 2 - 14)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('font-weight', '700').attr('fill', '#065f46')
            .text('After');

        // ── Bottom takeaway ──
        svg.append('text')
            .attr('x', W / 2).attr('y', H - 28)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#374151').attr('font-style', 'italic')
            .text('Not about being faster at what you already do.');

        svg.append('text')
            .attr('x', W / 2).attr('y', H - 10)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#1f2937').attr('font-weight', '600')
            .text('About reaching options you would never have considered.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', '#1f2937').attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── INSTITUTIONAL CONTEXT (boundary map) ──────────────────
    function institutionalContext(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent bg for test harness
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var cx = W / 2, cy = 265;

        // ── Layers from outermost to innermost ──
        // Each layer: label, color, whether AI can see it
        var layers = [
            {
                label: 'Organizational Readiness for Change',
                color: '#92400e',
                fill: '#fffbeb',
                visible: false
            },
            {
                label: 'Regulatory Requirements (inherited, not chosen)',
                color: '#991b1b',
                fill: '#fef2f2',
                visible: false
            },
            {
                label: 'Colleague Trust & Cooperation Networks',
                color: '#5b21b6',
                fill: '#f5f3ff',
                visible: false
            },
            {
                label: 'Departmental Ownership Boundaries',
                color: '#1e3a5f',
                fill: '#eff6ff',
                visible: false
            },
            {
                label: 'Epic / Beaker Integration Timelines',
                color: '#065f46',
                fill: '#ecfdf5',
                visible: false
            },
            {
                label: 'Your System',
                color: '#1f2937',
                fill: '#f0fdf4',
                visible: true
            }
        ];

        var n = layers.length;
        // Nested rectangle dimensions — outermost to innermost
        var outerW = 920, outerH = 420;
        var innerW = 180, innerH = 100;
        var stepW = (outerW - innerW) / (n - 1);
        var stepH = (outerH - innerH) / (n - 1);

        // ── Draw layers from outside in ──
        layers.forEach(function (layer, i) {
            var rw = outerW - i * stepW;
            var rh = outerH - i * stepH;
            var rx = cx - rw / 2;
            var ry = cy - rh / 2;

            var g = svg.append('g');

            // Rectangle
            g.append('rect')
                .attr('x', rx).attr('y', ry)
                .attr('width', rw).attr('height', rh)
                .attr('rx', i === n - 1 ? 4 : 2)
                .attr('fill', layer.fill)
                .attr('stroke', layer.color)
                .attr('stroke-width', i === n - 1 ? 2.5 : 1.5)
                .attr('stroke-dasharray', layer.visible ? 'none' : '8,4')
                .attr('stroke-opacity', layer.visible ? 1 : 0.6);

            // Label — positioned at top-left of each ring
            if (i < n - 1) {
                // Outer layers: label along top edge, inside the ring
                var labelX = rx + 14;
                var labelY = ry + 16;

                g.append('text')
                    .attr('x', labelX).attr('y', labelY)
                    .attr('font-size', '11px')
                    .attr('font-weight', '600')
                    .attr('fill', layer.color)
                    .text(layer.label);
            } else {
                // Innermost: centered label
                g.append('text')
                    .attr('x', cx).attr('y', cy - 6)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '15px')
                    .attr('font-weight', '700')
                    .attr('fill', layer.color)
                    .text(layer.label);

                g.append('text')
                    .attr('x', cx).attr('y', cy + 14)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '10px')
                    .attr('fill', '#6b7280')
                    .attr('letter-spacing', '1px')
                    .text('WHAT AI CAN SEE');
            }
        });

        // ── AI Visibility Horizon line ──
        // Drawn between the innermost and second-innermost layers
        var horizonLayer = n - 2; // Epic/Beaker layer index
        var hRw = outerW - horizonLayer * stepW;
        var hRh = outerH - horizonLayer * stepH;
        var hRx = cx - hRw / 2;
        var hRy = cy - hRh / 2;

        // Horizontal line across the full width at the boundary
        var lineY = hRy + hRh + 8;

        // Right-side annotation with arrow pointing inward
        var annotX = cx + outerW / 2 - 10;
        var arrowTipX = cx + innerW / 2 + 20;

        // Arrow line
        svg.append('line')
            .attr('x1', annotX).attr('y1', lineY)
            .attr('x2', arrowTipX).attr('y2', lineY)
            .attr('stroke', '#dc2626').attr('stroke-width', 2)
            .attr('stroke-opacity', 0.7);

        // Arrowhead
        svg.append('polygon')
            .attr('points', function () {
                var tx = arrowTipX;
                var ty = lineY;
                return (tx) + ',' + (ty) + ' ' +
                    (tx + 8) + ',' + (ty - 4) + ' ' +
                    (tx + 8) + ',' + (ty + 4);
            })
            .attr('fill', '#dc2626').attr('fill-opacity', 0.7);

        // "AI VISIBILITY HORIZON" label
        svg.append('text')
            .attr('x', annotX + 4).attr('y', lineY + 4)
            .attr('text-anchor', 'start')
            .attr('font-size', '9px')
            .attr('font-weight', '700')
            .attr('fill', '#dc2626')
            .attr('letter-spacing', '1px')
            .text('AI VISIBILITY');

        svg.append('text')
            .attr('x', annotX + 4).attr('y', lineY + 15)
            .attr('text-anchor', 'start')
            .attr('font-size', '9px')
            .attr('font-weight', '700')
            .attr('fill', '#dc2626')
            .attr('letter-spacing', '1px')
            .text('HORIZON');

        // Left-side: mirror arrow
        var leftAnnotX = cx - outerW / 2 + 10;
        var leftArrowTipX = cx - innerW / 2 - 20;

        svg.append('line')
            .attr('x1', leftAnnotX).attr('y1', lineY)
            .attr('x2', leftArrowTipX).attr('y2', lineY)
            .attr('stroke', '#dc2626').attr('stroke-width', 2)
            .attr('stroke-opacity', 0.7);

        svg.append('polygon')
            .attr('points', function () {
                var tx = leftArrowTipX;
                var ty = lineY;
                return (tx) + ',' + (ty) + ' ' +
                    (tx - 8) + ',' + (ty - 4) + ' ' +
                    (tx - 8) + ',' + (ty + 4);
            })
            .attr('fill', '#dc2626').attr('fill-opacity', 0.7);

        svg.append('text')
            .attr('x', leftAnnotX - 4).attr('y', lineY + 4)
            .attr('text-anchor', 'end')
            .attr('font-size', '9px')
            .attr('font-weight', '700')
            .attr('fill', '#dc2626')
            .attr('letter-spacing', '1px')
            .text('AI VISIBILITY');

        svg.append('text')
            .attr('x', leftAnnotX - 4).attr('y', lineY + 15)
            .attr('text-anchor', 'end')
            .attr('font-size', '9px')
            .attr('font-weight', '700')
            .attr('fill', '#dc2626')
            .attr('letter-spacing', '1px')
            .text('HORIZON');

        // ── Top title annotation ──
        svg.append('text')
            .attr('x', cx).attr('y', 22)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px')
            .attr('fill', '#6b7280')
            .attr('letter-spacing', '1.5px')
            .text('INSTITUTIONAL CONTEXT — INVISIBLE TO THE MODEL');

        // ── Bottom takeaway ──
        svg.append('text')
            .attr('x', cx).attr('y', H - 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px')
            .attr('fill', '#374151')
            .attr('font-style', 'italic')
            .text('Institutional knowledge is not data. AI cannot retrieve it from a prompt.');

        svg.append('text')
            .attr('x', cx).attr('y', H - 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px')
            .attr('fill', '#1f2937')
            .attr('font-weight', '600')
            .text('The human in the institutional context is irreplaceable.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', '#1f2937').attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── THREE OBSERVATIONS CONVERGENCE ────────────────────────
    function threeObservations(container, config) {
        var W = 1050, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent background for test harness detection
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var cx = W / 2;

        // ── Color palette (Bauhaus-inspired, WCAG AA on white) ──
        var obs = [
            {
                color: '#991b1b',       // deep crimson
                accent: '#fef2f2',      // faint blush bg
                num: '1',
                keyword: 'Domain Knowledge',
                verb: 'went up in value',
                line1: 'AI handles the generic.',
                line2: 'The specific becomes more valuable.',
                icon: 'diamond'         // expertise = cut gem
            },
            {
                color: '#1e3a5f',       // deep navy
                accent: '#eff6ff',      // faint blue bg
                num: '2',
                keyword: 'Architectural Clarity',
                verb: 'is now a forcing function',
                line1: 'Vague requirements produce',
                line2: 'working code that does the wrong thing.',
                icon: 'square'          // structure = square
            },
            {
                color: '#92400e',       // deep amber
                accent: '#fffbeb',      // faint warm bg
                num: '3',
                keyword: 'Human Judgment',
                verb: 'is the differentiator',
                line1: 'Not the model. Not the tool.',
                line2: 'The person who knows what and why.',
                icon: 'circle'          // human = circle
            }
        ];

        var panelW = 280, panelH = 320, panelGap = 42;
        var panelY = 30;
        var totalW = obs.length * panelW + (obs.length - 1) * panelGap;
        var startX = (W - totalW) / 2;

        // ── Convergence point ──
        var focalY = panelY + panelH + 80;
        var focalR = 36;

        // ── Draw convergence lines FIRST (behind panels) ──
        obs.forEach(function (o, i) {
            var px = startX + i * (panelW + panelGap) + panelW / 2;
            var lineStartY = panelY + panelH + 4;

            svg.append('line')
                .attr('x1', px).attr('y1', lineStartY)
                .attr('x2', cx).attr('y2', focalY - focalR - 4)
                .attr('stroke', o.color).attr('stroke-width', 2.5)
                .attr('stroke-opacity', 0.5)
                .attr('stroke-dasharray', '6,4');
        });

        // ── Draw panels ──
        obs.forEach(function (o, i) {
            var px = startX + i * (panelW + panelGap);
            var pCx = px + panelW / 2;
            var g = svg.append('g');

            // Panel background
            g.append('rect')
                .attr('x', px).attr('y', panelY)
                .attr('width', panelW).attr('height', panelH)
                .attr('rx', 4)
                .attr('fill', o.accent)
                .attr('stroke', o.color).attr('stroke-width', 2)
                .attr('stroke-opacity', 0.3);

            // Top color bar (Bauhaus accent)
            g.append('rect')
                .attr('x', px).attr('y', panelY)
                .attr('width', panelW).attr('height', 6)
                .attr('rx', 0).attr('fill', o.color);
            // Round just the top corners by overlaying the bar
            g.append('rect')
                .attr('x', px).attr('y', panelY)
                .attr('width', panelW).attr('height', 6)
                .attr('rx', 4).attr('fill', o.color);
            g.append('rect')
                .attr('x', px).attr('y', panelY + 3)
                .attr('width', panelW).attr('height', 3)
                .attr('fill', o.color);

            // Geometric icon (Bauhaus shapes)
            var iconY = panelY + 56;
            var iconSize = 28;
            if (o.icon === 'diamond') {
                g.append('rect')
                    .attr('x', pCx - iconSize / 2).attr('y', iconY - iconSize / 2)
                    .attr('width', iconSize).attr('height', iconSize)
                    .attr('fill', 'none').attr('stroke', o.color).attr('stroke-width', 2.5)
                    .attr('transform', 'rotate(45,' + pCx + ',' + iconY + ')');
            } else if (o.icon === 'square') {
                g.append('rect')
                    .attr('x', pCx - iconSize / 2).attr('y', iconY - iconSize / 2)
                    .attr('width', iconSize).attr('height', iconSize)
                    .attr('fill', 'none').attr('stroke', o.color).attr('stroke-width', 2.5);
            } else if (o.icon === 'circle') {
                g.append('circle')
                    .attr('cx', pCx).attr('cy', iconY).attr('r', iconSize / 2)
                    .attr('fill', 'none').attr('stroke', o.color).attr('stroke-width', 2.5);
            }

            // Number inside icon
            g.append('text')
                .attr('x', pCx).attr('y', iconY + 5)
                .attr('text-anchor', 'middle').attr('font-size', '15px')
                .attr('font-weight', '700').attr('fill', o.color)
                .text(o.num);

            // Keyword heading
            g.append('text')
                .attr('x', pCx).attr('y', iconY + 46)
                .attr('text-anchor', 'middle').attr('font-size', '17px')
                .attr('font-weight', '700').attr('fill', o.color)
                .text(o.keyword);

            // Verb/relationship (lighter weight)
            g.append('text')
                .attr('x', pCx).attr('y', iconY + 68)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('font-weight', '400').attr('fill', '#4b5563')
                .attr('font-style', 'italic')
                .text(o.verb);

            // Horizontal rule
            g.append('line')
                .attr('x1', px + 30).attr('y1', iconY + 84)
                .attr('x2', px + panelW - 30).attr('y2', iconY + 84)
                .attr('stroke', o.color).attr('stroke-width', 1).attr('stroke-opacity', 0.25);

            // Distilled insight (two lines)
            g.append('text')
                .attr('x', pCx).attr('y', iconY + 110)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('fill', '#1f2937')
                .text(o.line1);

            g.append('text')
                .attr('x', pCx).attr('y', iconY + 130)
                .attr('text-anchor', 'middle').attr('font-size', '13px')
                .attr('fill', '#1f2937')
                .attr('font-weight', '600')
                .text(o.line2);

            // Bauhaus bottom rule inside panel
            g.append('line')
                .attr('x1', px + 20).attr('y1', panelY + panelH - 20)
                .attr('x2', px + panelW - 20).attr('y2', panelY + panelH - 20)
                .attr('stroke', o.color).attr('stroke-width', 1).attr('stroke-opacity', 0.15);

            // "Observation" label at bottom of panel
            g.append('text')
                .attr('x', pCx).attr('y', panelY + panelH - 8)
                .attr('text-anchor', 'middle').attr('font-size', '9px')
                .attr('fill', '#6b7280').attr('letter-spacing', '2px')
                .text('OBSERVATION');
        });

        // ── Focal convergence point ──
        // Outer ring (subtle)
        svg.append('circle')
            .attr('cx', cx).attr('cy', focalY).attr('r', focalR + 6)
            .attr('fill', 'none').attr('stroke', '#1f2937').attr('stroke-width', 1.5)
            .attr('stroke-opacity', 0.2);

        // Inner circle (outlined, Bauhaus-style)
        svg.append('circle')
            .attr('cx', cx).attr('cy', focalY).attr('r', focalR)
            .attr('fill', '#f9fafb')
            .attr('stroke', '#1f2937').attr('stroke-width', 3);

        // "YOU" label
        svg.append('text')
            .attr('x', cx).attr('y', focalY + 7)
            .attr('text-anchor', 'middle').attr('font-size', '20px')
            .attr('font-weight', '700').attr('fill', '#1f2937')
            .attr('letter-spacing', '3px')
            .text('YOU');

        // ── Takeaway line below focal point ──
        svg.append('text')
            .attr('x', cx).attr('y', focalY + focalR + 30)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('fill', '#374151').attr('font-style', 'italic')
            .text('The differentiator was always you.');

        // ── Top annotation ──
        svg.append('text')
            .attr('x', cx).attr('y', 16)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280').attr('letter-spacing', '1.5px')
            .text('OBSERVATIONS, NOT PRESCRIPTIONS');

        // ── Bauhaus rule at very bottom ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 8)
            .attr('x2', W - 40).attr('y2', H - 8)
            .attr('stroke', '#1f2937').attr('stroke-width', 1).attr('stroke-opacity', 0.15);
    }


    // ─── XENONYM SYNTHESIS (horizon expansion) ──────────────
    function xenonymSynthesis(container, config) {
        var W = 1100, H = 560;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var darkText = '#1f2937';
        var cx = W / 2;

        // ── Color palette ──
        var seedColor = '#991b1b';
        var aiColor = '#1e3a5f';
        var emergeColor = '#065f46';
        var accentGold = '#92400e';

        // ══════════════════════════════════════════════
        // TOP ANNOTATION
        // ══════════════════════════════════════════════
        svg.append('text')
            .attr('x', cx).attr('y', 22)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280').attr('letter-spacing', '1.5px')
            .text('WHAT XENONYM ILLUSTRATES');

        // ══════════════════════════════════════════════
        // LEFT: THE SEED PROBLEM (narrow)
        // ══════════════════════════════════════════════
        var seedX = 40, seedY = 60, seedW = 180, seedH = 130;

        svg.append('rect')
            .attr('x', seedX).attr('y', seedY)
            .attr('width', seedW).attr('height', seedH)
            .attr('rx', 3)
            .attr('fill', '#fef2f2')
            .attr('stroke', seedColor).attr('stroke-width', 2);

        // Top accent bar
        svg.append('rect')
            .attr('x', seedX).attr('y', seedY)
            .attr('width', seedW).attr('height', 5)
            .attr('fill', seedColor);

        svg.append('text')
            .attr('x', seedX + seedW / 2).attr('y', seedY + 34)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', seedColor)
            .text('Seed Problem');

        svg.append('text')
            .attr('x', seedX + seedW / 2).attr('y', seedY + 56)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#4b5563')
            .text('"I need safe test names"');

        svg.append('text')
            .attr('x', seedX + seedW / 2).attr('y', seedY + 76)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280')
            .text('Narrow, specific,');
        svg.append('text')
            .attr('x', seedX + seedW / 2).attr('y', seedY + 90)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#6b7280')
            .text('single-use intent');

        // Label below seed
        svg.append('text')
            .attr('x', seedX + seedW / 2).attr('y', seedY + seedH + 18)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', seedColor).attr('letter-spacing', '1.5px')
            .text('WOULD NOT HAVE BEEN BUILT');

        // ══════════════════════════════════════════════
        // EXPANSION ARROW: seed → AI zone
        // ══════════════════════════════════════════════
        var arrowX1 = seedX + seedW + 12;
        var arrowX2 = 290;
        var arrowY = seedY + seedH / 2;

        svg.append('line')
            .attr('x1', arrowX1).attr('y1', arrowY)
            .attr('x2', arrowX2).attr('y2', arrowY)
            .attr('stroke', darkText).attr('stroke-width', 2);
        svg.append('polygon')
            .attr('points',
                arrowX2 + ',' + arrowY + ' ' +
                (arrowX2 - 8) + ',' + (arrowY - 4) + ' ' +
                (arrowX2 - 8) + ',' + (arrowY + 4))
            .attr('fill', darkText);

        svg.append('text')
            .attr('x', (arrowX1 + arrowX2) / 2).attr('y', arrowY - 10)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', '#6b7280').attr('font-style', 'italic')
            .text('AI made it feasible');

        // ══════════════════════════════════════════════
        // CENTER: AI INTERVENTION — THREE FACETS
        // ══════════════════════════════════════════════
        var aiZoneX = 300, aiZoneY = 40, aiZoneW = 460, aiZoneH = 180;

        // Subtle background for the AI zone
        svg.append('rect')
            .attr('x', aiZoneX).attr('y', aiZoneY)
            .attr('width', aiZoneW).attr('height', aiZoneH)
            .attr('rx', 4)
            .attr('fill', '#eff6ff')
            .attr('stroke', aiColor).attr('stroke-width', 1.5)
            .attr('stroke-dasharray', '8,4');

        svg.append('text')
            .attr('x', aiZoneX + aiZoneW / 2).attr('y', aiZoneY + 22)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-weight', '700').attr('fill', aiColor)
            .attr('letter-spacing', '1.5px')
            .text('AI EXPANDED THE HORIZON');

        // Three facet cards inside the AI zone
        var facets = [
            {
                title: 'Cross-Domain',
                title2: 'Discovery',
                body: 'Surfaced computational',
                body2: 'linguistics — a domain',
                body3: 'you would not have searched',
                icon: 'diamond'
            },
            {
                title: 'Edge Case',
                title2: 'Anticipation',
                body: 'Systematic adversarial',
                body2: 'testing before production',
                body3: 'needs it',
                icon: 'square'
            },
            {
                title: 'Architectural',
                title2: 'Generalization',
                body: 'Recognized the pattern',
                body2: 'is more general: flexible',
                body3: 'schema, not predefined',
                icon: 'circle'
            }
        ];

        var fCardW = 136, fCardH = 120, fCardGap = 12;
        var fStartX = aiZoneX + (aiZoneW - (facets.length * fCardW + (facets.length - 1) * fCardGap)) / 2;
        var fStartY = aiZoneY + 36;

        facets.forEach(function (f, i) {
            var fx = fStartX + i * (fCardW + fCardGap);
            var fCx = fx + fCardW / 2;

            svg.append('rect')
                .attr('x', fx).attr('y', fStartY)
                .attr('width', fCardW).attr('height', fCardH)
                .attr('rx', 3)
                .attr('fill', 'white')
                .attr('stroke', aiColor).attr('stroke-width', 1.5);

            // Bauhaus icon
            var iconY = fStartY + 20;
            var iconSize = 14;
            if (f.icon === 'diamond') {
                svg.append('rect')
                    .attr('x', fCx - iconSize / 2).attr('y', iconY - iconSize / 2)
                    .attr('width', iconSize).attr('height', iconSize)
                    .attr('fill', 'none').attr('stroke', aiColor).attr('stroke-width', 2)
                    .attr('transform', 'rotate(45,' + fCx + ',' + iconY + ')');
            } else if (f.icon === 'square') {
                svg.append('rect')
                    .attr('x', fCx - iconSize / 2).attr('y', iconY - iconSize / 2)
                    .attr('width', iconSize).attr('height', iconSize)
                    .attr('fill', 'none').attr('stroke', aiColor).attr('stroke-width', 2);
            } else {
                svg.append('circle')
                    .attr('cx', fCx).attr('cy', iconY).attr('r', iconSize / 2)
                    .attr('fill', 'none').attr('stroke', aiColor).attr('stroke-width', 2);
            }

            // Title (two lines)
            svg.append('text')
                .attr('x', fCx).attr('y', iconY + 24)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('font-weight', '700').attr('fill', aiColor)
                .text(f.title);
            svg.append('text')
                .attr('x', fCx).attr('y', iconY + 38)
                .attr('text-anchor', 'middle').attr('font-size', '12px')
                .attr('font-weight', '700').attr('fill', aiColor)
                .text(f.title2);

            // Body (three lines)
            svg.append('text')
                .attr('x', fCx).attr('y', iconY + 58)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#4b5563')
                .text(f.body);
            svg.append('text')
                .attr('x', fCx).attr('y', iconY + 72)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#4b5563')
                .text(f.body2);
            svg.append('text')
                .attr('x', fCx).attr('y', iconY + 86)
                .attr('text-anchor', 'middle').attr('font-size', '10px')
                .attr('fill', '#4b5563')
                .text(f.body3);
        });

        // ══════════════════════════════════════════════
        // EXPANSION ARROW: AI zone → emerged tool
        // ══════════════════════════════════════════════
        var arrow2X1 = aiZoneX + aiZoneW + 12;
        var arrow2X2 = 830;
        var arrow2Y = aiZoneY + aiZoneH / 2;

        svg.append('line')
            .attr('x1', arrow2X1).attr('y1', arrow2Y)
            .attr('x2', arrow2X2).attr('y2', arrow2Y)
            .attr('stroke', darkText).attr('stroke-width', 2);
        svg.append('polygon')
            .attr('points',
                arrow2X2 + ',' + arrow2Y + ' ' +
                (arrow2X2 - 8) + ',' + (arrow2Y - 4) + ' ' +
                (arrow2X2 - 8) + ',' + (arrow2Y + 4))
            .attr('fill', darkText);

        // ══════════════════════════════════════════════
        // RIGHT: WHAT EMERGED (wide, open)
        // ══════════════════════════════════════════════
        var emergeX = 840, emergeY = 42, emergeW = 230, emergeH = 175;

        svg.append('rect')
            .attr('x', emergeX).attr('y', emergeY)
            .attr('width', emergeW).attr('height', emergeH)
            .attr('rx', 3)
            .attr('fill', '#ecfdf5')
            .attr('stroke', emergeColor).attr('stroke-width', 2);

        // Top accent bar
        svg.append('rect')
            .attr('x', emergeX).attr('y', emergeY)
            .attr('width', emergeW).attr('height', 5)
            .attr('fill', emergeColor);

        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 30)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', emergeColor)
            .text('What Emerged');

        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 52)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#374151')
            .text('A general-purpose');
        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 66)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', '#374151')
            .text('supplementary tool');

        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 90)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#4b5563')
            .text('Flexible schema');
        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 104)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#4b5563')
            .text('Adversarial edge cases');
        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + 118)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', '#4b5563')
            .text('Fully public');

        // Label below emerge
        svg.append('text')
            .attr('x', emergeX + emergeW / 2).attr('y', emergeY + emergeH + 18)
            .attr('text-anchor', 'middle').attr('font-size', '9px')
            .attr('fill', emergeColor).attr('letter-spacing', '1.5px')
            .text('WOULD NOT HAVE EXISTED');

        // ══════════════════════════════════════════════
        // BOTTOM: INTEGRITY BY CONSTRUCTION
        // ══════════════════════════════════════════════
        var intY = 280;

        // Divider line
        svg.append('line')
            .attr('x1', 60).attr('y1', intY)
            .attr('x2', W - 60).attr('y2', intY)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.15);

        // Section heading
        svg.append('text')
            .attr('x', cx).attr('y', intY + 30)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-weight', '700').attr('fill', accentGold)
            .attr('letter-spacing', '1.5px')
            .text('SYSTEM INTEGRITY BY CONSTRUCTION, NOT BY RESTRICTION');

        // Two contrasting approaches
        var contrastY = intY + 50;
        var contrastW = 420, contrastH = 130, contrastGap = 60;
        var leftX = cx - contrastW - contrastGap / 2;
        var rightX = cx + contrastGap / 2;

        // Left: restriction approach (faded, struck)
        svg.append('rect')
            .attr('x', leftX).attr('y', contrastY)
            .attr('width', contrastW).attr('height', contrastH)
            .attr('rx', 3)
            .attr('fill', '#fef2f2')
            .attr('stroke', seedColor).attr('stroke-width', 1)
            .attr('stroke-opacity', 0.4);

        svg.append('text')
            .attr('x', leftX + contrastW / 2).attr('y', contrastY + 26)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', seedColor)
            .attr('fill-opacity', 0.5)
            .text('By Restriction');

        var restrictLines = [
            'Hide real data behind access controls',
            'Hope edge cases don\u2019t appear in production',
            'Restrict inputs to avoid breakage'
        ];
        restrictLines.forEach(function (line, i) {
            svg.append('text')
                .attr('x', leftX + contrastW / 2).attr('y', contrastY + 54 + i * 20)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('fill', seedColor).attr('fill-opacity', 0.45)
                .text(line);
        });

        // Strike-through across left panel
        svg.append('line')
            .attr('x1', leftX + 30).attr('y1', contrastY + contrastH / 2)
            .attr('x2', leftX + contrastW - 30).attr('y2', contrastY + contrastH / 2)
            .attr('stroke', seedColor).attr('stroke-width', 2)
            .attr('stroke-opacity', 0.35);

        // Right: construction approach (bold, present)
        svg.append('rect')
            .attr('x', rightX).attr('y', contrastY)
            .attr('width', contrastW).attr('height', contrastH)
            .attr('rx', 3)
            .attr('fill', '#ecfdf5')
            .attr('stroke', emergeColor).attr('stroke-width', 2);

        svg.append('text')
            .attr('x', rightX + contrastW / 2).attr('y', contrastY + 26)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', emergeColor)
            .text('By Construction');

        var constructLines = [
            'Generate adversarial cases deliberately',
            'Test edge cases before they reach production',
            'The data itself ensures integrity'
        ];
        constructLines.forEach(function (line, i) {
            svg.append('text')
                .attr('x', rightX + contrastW / 2).attr('y', contrastY + 54 + i * 20)
                .attr('text-anchor', 'middle').attr('font-size', '11px')
                .attr('fill', '#374151')
                .text(line);
        });

        // ══════════════════════════════════════════════
        // BOTTOM: TAKEAWAY
        // ══════════════════════════════════════════════
        var takeY = contrastY + contrastH + 40;

        svg.append('line')
            .attr('x1', 160).attr('y1', takeY)
            .attr('x2', W - 160).attr('y2', takeY)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.15);

        svg.append('text')
            .attr('x', cx).attr('y', takeY + 32)
            .attr('text-anchor', 'middle').attr('font-size', '16px')
            .attr('font-weight', '700').attr('fill', darkText)
            .text('AI qualitatively transformed the development of supplementary technologies.');

        svg.append('text')
            .attr('x', cx).attr('y', takeY + 56)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', '#374151').attr('font-style', 'italic')
            .text('Tools that were never worth building now emerge naturally from the work.');

        // ── Bauhaus bottom rule ──
        svg.append('line')
            .attr('x1', 40).attr('y1', H - 4)
            .attr('x2', W - 40).attr('y2', H - 4)
            .attr('stroke', darkText).attr('stroke-width', 1).attr('stroke-opacity', 0.12);
    }


    // ─── IBIS FLOW — natural-language search + provenance pathway ──
    function ibisFlow(container, config) {
        var W = 1200, H = 700;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        // Transparent bg for test harness
        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var ink     = '#1f2937';
        var subInk  = '#4b5563';
        var muted   = '#6b7280';
        var rule    = '#cbd5e1';
        var accent  = '#1B3A5C';
        var green   = '#065f46';
        var crimson = '#991b1b';

        // ─── TITLE BLOCK (centered) — skipped when the slide carries its own title ─
        if (!config || !config.hideHeader) {
            svg.append('text')
                .attr('x', W / 2).attr('y', 56)
                .attr('text-anchor', 'middle')
                .attr('font-size', '26px').attr('font-weight', '700')
                .attr('fill', accent)
                .text('IBIS — Natural-Language Search Over Pathology Data');

            svg.append('text')
                .attr('x', W / 2).attr('y', 84)
                .attr('text-anchor', 'middle')
                .attr('font-size', '15px').attr('fill', subInk)
                .text('What a small team can now deliver — live demo');

            svg.append('line')
                .attr('x1', 80).attr('y1', 102).attr('x2', W - 80).attr('y2', 102)
                .attr('stroke', rule).attr('stroke-width', 1);
        }

        // ─── REGISTER 1: WHAT THE USER DOES ─────────────────
        svg.append('text')
            .attr('x', W / 2).attr('y', 128)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-weight', '700')
            .attr('fill', muted).attr('letter-spacing', '2.5px')
            .text('REGISTER 1   ·   WHAT THE USER DOES');

        var topY = 220;

        // Node 1: Clinician (far left — pulled in to give the natural-language
        // question above arrow 1 a much wider canvas)
        var n1x = 85, nodeR = 52;
        svg.append('circle')
            .attr('cx', n1x).attr('cy', topY).attr('r', nodeR)
            .attr('fill', 'white').attr('stroke', ink).attr('stroke-width', 2);
        svg.append('text')
            .attr('x', n1x).attr('y', topY - 4)
            .attr('text-anchor', 'middle').attr('font-size', '15px')
            .attr('font-weight', '700').attr('fill', ink)
            .text('Clinician');
        svg.append('text')
            .attr('x', n1x).attr('y', topY + 16)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('fill', subInk).text('Researcher');

        // IBIS box (center)
        var ibisW = 240, ibisH = 110;
        var ibisCx = 600;
        var ibisX = ibisCx - ibisW / 2;
        var ibisY = topY - ibisH / 2;

        svg.append('rect')
            .attr('x', ibisX).attr('y', ibisY)
            .attr('width', ibisW).attr('height', ibisH)
            .attr('fill', 'white').attr('stroke', accent).attr('stroke-width', 2.5);
        svg.append('text')
            .attr('x', ibisCx).attr('y', topY - 22)
            .attr('text-anchor', 'middle').attr('font-size', '24px')
            .attr('font-weight', '700').attr('fill', accent).text('IBIS');
        svg.append('text')
            .attr('x', ibisCx).attr('y', topY + 2)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', subInk).text('natural language → query');
        svg.append('text')
            .attr('x', ibisCx).attr('y', topY + 22)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', subInk).text('over structured + unstructured data');

        // Cohort answer (right)
        var ansW = 200, ansH = 110;
        var ansCx = 980;
        var ansX = ansCx - ansW / 2;
        var ansY = topY - ansH / 2;
        svg.append('rect')
            .attr('x', ansX).attr('y', ansY)
            .attr('width', ansW).attr('height', ansH)
            .attr('fill', 'white').attr('stroke', ink).attr('stroke-width', 2);
        svg.append('text')
            .attr('x', ansCx).attr('y', ansY + 22)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-weight', '700').attr('fill', subInk)
            .attr('letter-spacing', '1.5px').text('COHORT · 187 CASES');

        // sparkline bars
        var bars = [22, 38, 31, 47, 58, 44, 62];
        var barW = 18, barGap = 6;
        var barsTotalW = bars.length * barW + (bars.length - 1) * barGap;
        var barsStartX = ansCx - barsTotalW / 2;
        var barBaseY = ansY + ansH - 14;
        bars.forEach(function (v, i) {
            svg.append('rect')
                .attr('x', barsStartX + i * (barW + barGap))
                .attr('y', barBaseY - v)
                .attr('width', barW).attr('height', v)
                .attr('fill', accent).attr('fill-opacity', 0.85);
        });

        // Arrow 1: clinician → IBIS  (cleared from clinician edge to IBIS edge)
        svg.append('line')
            .attr('x1', n1x + nodeR + 6).attr('y1', topY)
            .attr('x2', ibisX - 8).attr('y2', topY)
            .attr('stroke', ink).attr('stroke-width', 1.5);
        svg.append('path')
            .attr('d', 'M' + (ibisX - 8) + ',' + topY + ' l-9,-5 l0,10 z')
            .attr('fill', ink);

        // Arrow 2: IBIS → cohort
        svg.append('line')
            .attr('x1', ibisX + ibisW + 8).attr('y1', topY)
            .attr('x2', ansX - 8).attr('y2', topY)
            .attr('stroke', ink).attr('stroke-width', 1.5);
        svg.append('path')
            .attr('d', 'M' + (ansX - 8) + ',' + topY + ' l-9,-5 l0,10 z')
            .attr('fill', ink);

        // Question annotation — italicized, ABOVE arrow 1, well clear of nodes
        var arrow1Mid = (n1x + nodeR + 6 + ibisX - 8) / 2;
        svg.append('text')
            .attr('x', arrow1Mid).attr('y', topY - 38)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('fill', accent)
            .attr('font-style', 'italic')
            .text('"How many invasive ductal carcinomas');
        svg.append('text')
            .attr('x', arrow1Mid).attr('y', topY - 22)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('fill', accent)
            .attr('font-style', 'italic')
            .text('with HER2 amplification in the last 18 months?"');

        // "SECONDS, NOT WEEKS" — under arrow 2
        var arrow2Mid = (ibisX + ibisW + 8 + ansX - 8) / 2;
        svg.append('text')
            .attr('x', arrow2Mid).attr('y', topY + 22)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('fill', muted).attr('letter-spacing', '1.5px')
            .text('SECONDS, NOT WEEKS');

        // "no SQL · no analyst queue" — under cohort
        svg.append('text')
            .attr('x', ansCx).attr('y', ansY + ansH + 18)
            .attr('text-anchor', 'middle').attr('font-size', '12px')
            .attr('fill', green).attr('font-style', 'italic')
            .text('no SQL · no analyst queue');

        // ─── DIVIDING RULE ─────────────────────────────────
        svg.append('line')
            .attr('x1', 80).attr('y1', 340).attr('x2', W - 80).attr('y2', 340)
            .attr('stroke', rule).attr('stroke-width', 1);

        // ─── REGISTER 2: THE PATHWAY IN ─────────────────────
        svg.append('text')
            .attr('x', W / 2).attr('y', 366)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-weight', '700')
            .attr('fill', muted).attr('letter-spacing', '2.5px')
            .text('REGISTER 2   ·   THE PATHWAY IN');

        // ── Bottom register: outside Yale → perimeter → inside Yale ──
        var perimX = W / 2;
        var boxW = 480, boxH = 190;
        var bottomBoxY = 410;     // top of boxes
        var leftBoxX = perimX - boxW - 30;
        var rightBoxX = perimX + 30;

        // YALE SECURITY PERIMETER — label above
        svg.append('text')
            .attr('x', perimX).attr('y', bottomBoxY - 16)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('font-weight', '700').attr('fill', crimson)
            .attr('letter-spacing', '2px')
            .text('YALE SECURITY PERIMETER');

        // LEFT region (outside)
        svg.append('rect')
            .attr('x', leftBoxX).attr('y', bottomBoxY)
            .attr('width', boxW).attr('height', boxH)
            .attr('fill', 'white').attr('stroke', muted)
            .attr('stroke-width', 1).attr('stroke-dasharray', '5,4');

        svg.append('text')
            .attr('x', leftBoxX + boxW / 2).attr('y', bottomBoxY + 26)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('font-weight', '700')
            .attr('fill', muted).attr('letter-spacing', '2px')
            .text('OUTSIDE YALE   ·   PROTOTYPE');

        var leftItems = [
            'AI-assisted build',
            'Docker-based stack (Elasticsearch)',
            'Synthetic data only — no PHI',
            'Demonstrated from external machine'
        ];
        leftItems.forEach(function (txt, i) {
            var ly = bottomBoxY + 64 + i * 28;
            svg.append('circle')
                .attr('cx', leftBoxX + 38).attr('cy', ly - 4)
                .attr('r', 2.5).attr('fill', subInk);
            svg.append('text')
                .attr('x', leftBoxX + 50).attr('y', ly)
                .attr('font-size', '13px').attr('fill', subInk).text(txt);
        });

        // RIGHT region (inside)
        svg.append('rect')
            .attr('x', rightBoxX).attr('y', bottomBoxY)
            .attr('width', boxW).attr('height', boxH)
            .attr('fill', 'white').attr('stroke', accent).attr('stroke-width', 2);

        svg.append('text')
            .attr('x', rightBoxX + boxW / 2).attr('y', bottomBoxY + 26)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('font-weight', '700')
            .attr('fill', accent).attr('letter-spacing', '2px')
            .text('INSIDE YALE   ·   PRODUCTION');

        var rightItems = [
            'Brought in as open source',
            'Adopted to internal data model',
            'Enterprise GitHub  →  SPA review',
            'CI/CD · continuous integration'
        ];
        rightItems.forEach(function (txt, i) {
            var ry = bottomBoxY + 64 + i * 28;
            svg.append('circle')
                .attr('cx', rightBoxX + 38).attr('cy', ry - 4)
                .attr('r', 2.5).attr('fill', accent);
            svg.append('text')
                .attr('x', rightBoxX + 50).attr('y', ry)
                .attr('font-size', '13px').attr('fill', ink).text(txt);
        });

        // Vertical dashed perimeter line
        svg.append('line')
            .attr('x1', perimX).attr('y1', bottomBoxY - 6)
            .attr('x2', perimX).attr('y2', bottomBoxY + boxH + 6)
            .attr('stroke', crimson).attr('stroke-width', 2.5)
            .attr('stroke-dasharray', '6,4');

        // Crossing arrow under boxes
        var crossArrowY = bottomBoxY + boxH + 26;
        svg.append('line')
            .attr('x1', leftBoxX + boxW - 30).attr('y1', crossArrowY)
            .attr('x2', rightBoxX + 30).attr('y2', crossArrowY)
            .attr('stroke', accent).attr('stroke-width', 1.5);
        svg.append('path')
            .attr('d', 'M' + (rightBoxX + 30) + ',' + crossArrowY + ' l-9,-5 l0,10 z')
            .attr('fill', accent);
        svg.append('text')
            .attr('x', perimX).attr('y', crossArrowY - 12)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-style', 'italic').attr('fill', subInk)
            .text('the responsible pathway in');

        // ─── BOTTOM RULE & CLOSING LINE ─────────────────────
        svg.append('line')
            .attr('x1', 80).attr('y1', H - 42).attr('x2', W - 80).attr('y2', H - 42)
            .attr('stroke', rule).attr('stroke-width', 1);
        svg.append('text')
            .attr('x', W / 2).attr('y', H - 18)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-style', 'italic').attr('fill', subInk)
            .text('Better still: build it inside Yale from the start.   —   switch to live IBIS demo   —');
    }

    // ─── THE ASK — proven assets meet institutional gates ──
    function theAsk(container, config) {
        var W = 1200, H = 700;
        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%');

        svg.append('rect').attr('width', W).attr('height', H)
            .attr('fill', 'white').attr('fill-opacity', 0);

        var ink = '#1f2937';
        var subInk = '#4b5563';
        var muted = '#6b7280';
        var rule = '#cbd5e1';
        var accent = '#1B3A5C';
        var green = '#065f46';
        var crimson = '#991b1b';

        // ── Top section header ──
        svg.append('text')
            .attr('x', 60).attr('y', 56)
            .attr('font-size', '11px').attr('font-weight', '700')
            .attr('fill', muted).attr('letter-spacing', '2px')
            .text('WHAT EXISTS   ·   WHAT IS MISSING   ·   WHAT IT UNLOCKS');
        svg.append('line')
            .attr('x1', 60).attr('y1', 70).attr('x2', W - 60).attr('y2', 70)
            .attr('stroke', rule).attr('stroke-width', 1);

        // Layout columns
        var leftX = 90;
        var leftW = 280;
        var perimX = 580;
        var rightStartX = 640;
        var destX = 1010;
        var destW = 150;
        var midY = 360;

        // ── LEFT: PROVEN assets ──
        svg.append('text')
            .attr('x', leftX).attr('y', 120)
            .attr('font-size', '13px').attr('font-weight', '700')
            .attr('fill', green).attr('letter-spacing', '1.5px')
            .text('PROVEN');
        svg.append('line')
            .attr('x1', leftX).attr('y1', 130)
            .attr('x2', leftX + leftW).attr('y2', 130)
            .attr('stroke', green).attr('stroke-width', 1.5);

        var assets = [
            { label: 'Methodology',
              detail: 'DevSecOps inside Yale\u2019s perimeter — version control, dependency analysis, security review, CI/CD' },
            { label: 'Track record',
              detail: 'Twenty years building clinical software in pathology informatics' },
            { label: 'Velocity',
              detail: '~100× less effort to reach the same regulated quality bar with AI in the loop' },
            { label: 'Working tools',
              detail: 'Xenonym, IBIS, this presentation — all built with the methodology you just saw' }
        ];

        assets.forEach(function (a, i) {
            var ay = 170 + i * 100;

            // checkmark
            svg.append('path')
                .attr('d', 'M' + leftX + ',' + ay + ' l8,8 l16,-18')
                .attr('fill', 'none').attr('stroke', green)
                .attr('stroke-width', 2.5)
                .attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');

            svg.append('text')
                .attr('x', leftX + 36).attr('y', ay + 6)
                .attr('font-size', '15px').attr('font-weight', '700')
                .attr('fill', ink).text(a.label);

            // wrap detail in two lines
            var words = a.detail.split(' ');
            var line1 = '', line2 = '';
            var maxChars = 38;
            words.forEach(function (w) {
                if (line1.length + w.length + 1 <= maxChars) {
                    line1 += (line1 ? ' ' : '') + w;
                } else {
                    line2 += (line2 ? ' ' : '') + w;
                }
            });
            svg.append('text')
                .attr('x', leftX + 36).attr('y', ay + 24)
                .attr('font-size', '11px').attr('fill', subInk).text(line1);
            if (line2) {
                svg.append('text')
                    .attr('x', leftX + 36).attr('y', ay + 40)
                    .attr('font-size', '11px').attr('fill', subInk).text(line2);
            }
        });

        // ── PERIMETER: vertical dashed line ──
        var perimTop = 110, perimBot = 600;
        svg.append('line')
            .attr('x1', perimX).attr('y1', perimTop)
            .attr('x2', perimX).attr('y2', perimBot)
            .attr('stroke', crimson).attr('stroke-width', 2.5)
            .attr('stroke-dasharray', '6,4');

        // Rotated label
        svg.append('text')
            .attr('x', perimX).attr('y', perimTop - 14)
            .attr('text-anchor', 'middle').attr('font-size', '10px')
            .attr('font-weight', '700').attr('fill', crimson)
            .attr('letter-spacing', '1.5px')
            .text('YALE SECURITY PERIMETER');

        // ── DESTINATION on the right ──
        var destH = 200;
        var destY = midY - destH / 2;
        svg.append('rect')
            .attr('x', destX).attr('y', destY)
            .attr('width', destW).attr('height', destH)
            .attr('fill', 'white').attr('stroke', accent).attr('stroke-width', 2.5);
        svg.append('text')
            .attr('x', destX + destW / 2).attr('y', destY + destH / 2 - 28)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-weight', '700').attr('fill', muted)
            .attr('letter-spacing', '1.5px').text('UNLOCKS');
        svg.append('text')
            .attr('x', destX + destW / 2).attr('y', destY + destH / 2 - 4)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', accent).text('Sustained');
        svg.append('text')
            .attr('x', destX + destW / 2).attr('y', destY + destH / 2 + 12)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', accent).text('AI-assisted');
        svg.append('text')
            .attr('x', destX + destW / 2).attr('y', destY + destH / 2 + 28)
            .attr('text-anchor', 'middle').attr('font-size', '13px')
            .attr('font-weight', '700').attr('fill', accent).text('clinical software');
        svg.append('text')
            .attr('x', destX + destW / 2).attr('y', destY + destH / 2 + 50)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('fill', subInk).attr('font-style', 'italic').text('inside Yale');

        // ── THREE GATES (asks) — arrows piercing the perimeter ──
        var asks = [
            { num: '1', label: 'Enterprise LLM licenses',
              detail: 'sanctioned access to frontier models for research and clinical software development' },
            { num: '2', label: 'Ephemeral provider contracts',
              detail: 'short-lived, task-scoped agreements — no persistent data-sharing relationship' },
            { num: '3', label: 'Sanctioned development pathway',
              detail: 'an institutional route others can adopt, audit, and trust' }
        ];

        var gateYs = [200, 360, 520];

        asks.forEach(function (ask, i) {
            var gy = gateYs[i];

            // numeric badge on the left of perimeter
            var badgeX = perimX - 22;
            svg.append('circle')
                .attr('cx', badgeX).attr('cy', gy)
                .attr('r', 14).attr('fill', 'white')
                .attr('stroke', crimson).attr('stroke-width', 2);
            svg.append('text')
                .attr('x', badgeX).attr('y', gy + 5)
                .attr('text-anchor', 'middle').attr('font-size', '14px')
                .attr('font-weight', '700').attr('fill', crimson)
                .text(ask.num);

            // The "gate" — a gap in the perimeter at this y, drawn as a small white block
            svg.append('rect')
                .attr('x', perimX - 4).attr('y', gy - 8)
                .attr('width', 8).attr('height', 16)
                .attr('fill', 'white');

            // arrow from badge through the perimeter to destination box
            svg.append('line')
                .attr('x1', perimX + 8).attr('y1', gy)
                .attr('x2', destX - 6).attr('y2', gy)
                .attr('stroke', accent).attr('stroke-width', 1.5);
            svg.append('path')
                .attr('d', 'M' + (destX - 6) + ',' + gy + ' l-8,-5 l0,10 z')
                .attr('fill', accent);

            // label above the arrow
            svg.append('text')
                .attr('x', perimX + 24).attr('y', gy - 14)
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('fill', ink).text(ask.label);

            // detail below the arrow
            svg.append('text')
                .attr('x', perimX + 24).attr('y', gy + 18)
                .attr('font-size', '11px').attr('fill', subInk)
                .attr('font-style', 'italic').text(ask.detail);
        });

        // ── Bottom rule and closing line ──
        svg.append('line')
            .attr('x1', 60).attr('y1', H - 60).attr('x2', W - 60).attr('y2', H - 60)
            .attr('stroke', rule).attr('stroke-width', 1);
        svg.append('text')
            .attr('x', W / 2).attr('y', H - 32)
            .attr('text-anchor', 'middle').attr('font-size', '14px')
            .attr('font-weight', '700').attr('fill', accent)
            .text('The constraint is institutional, not technical — and it is solvable.');
        svg.append('text')
            .attr('x', W / 2).attr('y', H - 14)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-style', 'italic').attr('fill', muted)
            .text('I am not asking for a budget. I am asking for a pathway.');
    }


    // ─── LEARNING OBJECTIVES (Tufte progression) ─────────────
    function learningObjectives(container, config) {
        var W = 960, H = 540;
        var bg = '#1a1a2e', fg = '#e0e0e0', muted = '#7a8a9a';
        var accent = '#3b82f6', accent2 = '#22c55e', accent3 = '#f59e0b', accent4 = '#8b5cf6', accent5 = '#ef4444';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .style('width', '100%').style('max-height', '80vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");

        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        var stages = [
            { num: '1', label: 'Differentiate', sub: 'Informatics vs IT', detail: 'Why optimization depends\non informatics logic', color: accent, y: 0 },
            { num: '2', label: 'Identify', sub: 'The Functionality Gap', detail: 'Workflow needs that are\nattainable but absent', color: accent2, y: 1 },
            { num: '3', label: 'Explain', sub: 'AI Economics', detail: 'How AI changes the cost\nof closing those gaps', color: accent3, y: 0 },
            { num: '4', label: 'Evaluate', sub: 'Evidence', detail: 'IBIS · Xenonym · WBC ΔΣ\n· this presentation', color: accent4, y: 1 },
            { num: '5', label: 'Describe', sub: 'The Pathway', detail: 'spec → generate → test\n→ validate → deploy', color: accent5, y: 0 }
        ];

        var marginX = 100, marginTop = 100;
        var spacing = (W - 2 * marginX) / (stages.length - 1);
        var waveAmp = 40;

        // Title
        svg.append('text')
            .attr('x', W / 2).attr('y', 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '22px').attr('font-weight', '700').attr('fill', fg)
            .text('Learning Objectives');
        svg.append('text')
            .attr('x', W / 2).attr('y', 64)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('fill', muted).attr('font-style', 'italic')
            .text('A progression from understanding to action');

        // Compute positions
        stages.forEach(function(s, i) {
            s.cx = marginX + i * spacing;
            s.cy = marginTop + 160 + s.y * waveAmp;
        });

        // Draw connecting path (smooth curve through points)
        var lineGen = d3.line()
            .x(function(d) { return d.cx; })
            .y(function(d) { return d.cy; })
            .curve(d3.curveCatmullRom.alpha(0.5));

        svg.append('path')
            .attr('d', lineGen(stages))
            .attr('fill', 'none')
            .attr('stroke', muted).attr('stroke-width', 2)
            .attr('stroke-dasharray', function() { return this.getTotalLength(); })
            .attr('stroke-dashoffset', function() { return this.getTotalLength(); })
            .transition().duration(1500).ease(d3.easeCubicInOut)
            .attr('stroke-dashoffset', 0);

        // Draw arrow heads between stages
        stages.forEach(function(s, i) {
            if (i === stages.length - 1) return;
            var next = stages[i + 1];
            var dx = next.cx - s.cx, dy = next.cy - s.cy;
            var len = Math.sqrt(dx * dx + dy * dy);
            var ux = dx / len, uy = dy / len;
            var ax = next.cx - ux * 32, ay = next.cy - uy * 32;
            var arrowSize = 6;
            svg.append('polygon')
                .attr('points', function() {
                    var px = -uy, py = ux;
                    return [
                        (ax + ux * arrowSize) + ',' + (ay + uy * arrowSize),
                        (ax + px * arrowSize) + ',' + (ay + py * arrowSize),
                        (ax - px * arrowSize) + ',' + (ay - py * arrowSize)
                    ].join(' ');
                })
                .attr('fill', muted)
                .attr('opacity', 0)
                .transition().delay(1500 + i * 100).duration(300)
                .attr('opacity', 0.7);
        });

        // Draw stage nodes
        var nodeGroups = stages.map(function(s, i) {
            var g = svg.append('g')
                .attr('transform', 'translate(' + s.cx + ',' + s.cy + ')')
                .attr('opacity', 0);

            // Outer glow circle
            g.append('circle')
                .attr('r', 28)
                .attr('fill', 'none')
                .attr('stroke', s.color).attr('stroke-width', 1.5)
                .attr('opacity', 0.3);

            // Main circle
            g.append('circle')
                .attr('r', 22)
                .attr('fill', s.color).attr('fill-opacity', 0.15)
                .attr('stroke', s.color).attr('stroke-width', 2);

            // Number
            g.append('text')
                .attr('y', 6)
                .attr('text-anchor', 'middle')
                .attr('font-size', '16px').attr('font-weight', '700')
                .attr('fill', s.color)
                .text(s.num);

            // Verb label (above)
            g.append('text')
                .attr('y', -42)
                .attr('text-anchor', 'middle')
                .attr('font-size', '15px').attr('font-weight', '700')
                .attr('fill', fg)
                .text(s.label);

            // Subject (below circle)
            g.append('text')
                .attr('y', 46)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px').attr('font-weight', '600')
                .attr('fill', s.color)
                .text(s.sub);

            // Detail annotation (further below)
            var detailLines = s.detail.split('\n');
            detailLines.forEach(function(line, li) {
                g.append('text')
                    .attr('y', 64 + li * 14)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '10.5px')
                    .attr('fill', muted)
                    .text(line);
            });

            // Animate in with stagger
            g.transition()
                .delay(300 + i * 350)
                .duration(500)
                .ease(d3.easeCubicOut)
                .attr('opacity', 1);

            return g;
        });

        // Bottom annotation — Tufte sparkline-style progression label
        var progressY = H - 36;
        svg.append('line')
            .attr('x1', marginX).attr('x2', W - marginX)
            .attr('y1', progressY - 14).attr('y2', progressY - 14)
            .attr('stroke', muted).attr('stroke-width', 0.5).attr('opacity', 0.4);

        var progLabels = ['Foundations', '', 'Analysis', '', 'Action'];
        progLabels.forEach(function(lbl, i) {
            if (!lbl) return;
            svg.append('text')
                .attr('x', stages[i].cx).attr('y', progressY)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10px').attr('fill', muted)
                .attr('letter-spacing', '1.5px')
                .text(lbl.toUpperCase());
        });
    }


    // ─── REGISTRY (map name → function) ──────────────────────
    // ─── YOUR ROLE (Tufte-style action ladder on a commitment timeline) ──
    function yourRole(container, config) {
        var steps = (config && config.steps) || [];
        var epigraph = config && config.epigraph;
        var takeaway = config && config.takeaway;

        var W = 1280, H = 700;
        var margin = { top: 110, right: 80, bottom: 180, left: 80 };
        var plotW = W - margin.left - margin.right;

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('width', '100%').style('max-height', '82vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");

        // Warm paper background
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', '#faf7f2');

        // Title
        svg.append('text')
            .attr('x', W / 2).attr('y', 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '26px').attr('font-weight', '700').attr('fill', '#1a202c')
            .text('Your Role: What You Can Do Right Now');

        // Epigraph
        if (epigraph) {
            svg.append('text')
                .attr('x', W / 2).attr('y', 74)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px').attr('font-style', 'italic').attr('fill', '#64748b')
                .text('“' + epigraph.text + '”');
        }

        // Color progression from observer → builder → advocate
        var colors = ['#64748b', '#0e7490', '#0369a1', '#7c3aed', '#b45309'];

        var n = steps.length;
        var spacing = plotW / n;
        var nodeR = 44;
        var baselineY = margin.top + 160;

        // ─── Flow baseline (ascending line showing rising commitment) ───
        var lineStartX = margin.left + spacing / 2;
        var lineEndX = margin.left + plotW - spacing / 2;
        // Gentle ascending path
        var linePath = 'M ' + lineStartX + ' ' + (baselineY + 8) +
                       ' L ' + lineEndX + ' ' + (baselineY - 8);

        // Underlay thicker line (momentum)
        var linePathEl = svg.append('path')
            .attr('d', linePath)
            .attr('fill', 'none')
            .attr('stroke', '#e2d9c8')
            .attr('stroke-width', 10)
            .attr('stroke-linecap', 'round');

        // Animated drawing
        var totalLen = linePathEl.node().getTotalLength();
        linePathEl
            .attr('stroke-dasharray', totalLen + ' ' + totalLen)
            .attr('stroke-dashoffset', totalLen)
            .transition().duration(1200).ease(d3.easeCubicInOut)
            .attr('stroke-dashoffset', 0);

        // Arrowhead at end
        var defs = svg.append('defs');
        defs.append('marker')
            .attr('id', 'role-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 5).attr('refY', 0)
            .attr('markerWidth', 6).attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path').attr('d', 'M0,-5L10,0L0,5').attr('fill', '#b45309');

        svg.append('path')
            .attr('d', 'M ' + (lineEndX - 18) + ' ' + (baselineY - 6) +
                       ' L ' + (lineEndX + 8) + ' ' + (baselineY - 10))
            .attr('fill', 'none').attr('stroke', '#b45309').attr('stroke-width', 2)
            .attr('marker-end', 'url(#role-arrow)')
            .style('opacity', 0)
            .transition().delay(1200).duration(400).style('opacity', 1);

        // Time-commitment scale labels (below the nodes)
        var scaleLabels = ['TODAY', 'THIS WEEK', 'THIS MONTH', 'THIS QUARTER', 'THIS YEAR'];

        // ─── Each station: numbered disc, verb, description, timeline label ───
        steps.forEach(function(s, i) {
            var cx = margin.left + spacing / 2 + i * spacing;
            // Slight ascending Y to match the line
            var cy = baselineY + 8 - (i * 16 / (n - 1));
            var color = colors[i % colors.length];

            var g = svg.append('g').style('opacity', 0);

            // Halo (light)
            g.append('circle')
                .attr('cx', cx).attr('cy', cy).attr('r', nodeR + 10)
                .attr('fill', color).attr('fill-opacity', 0.08);

            // Main disc
            g.append('circle')
                .attr('cx', cx).attr('cy', cy).attr('r', nodeR)
                .attr('fill', '#ffffff')
                .attr('stroke', color).attr('stroke-width', 3);

            // Number
            g.append('text')
                .attr('x', cx).attr('y', cy + 12)
                .attr('text-anchor', 'middle')
                .attr('font-size', '36px').attr('font-weight', '800')
                .attr('fill', color)
                .text(s.number || (i + 1));

            // Action verb (above disc)
            g.append('text')
                .attr('x', cx).attr('y', cy - nodeR - 22)
                .attr('text-anchor', 'middle')
                .attr('font-size', '17px').attr('font-weight', '700')
                .attr('fill', '#1a202c')
                .attr('letter-spacing', '0.5px')
                .text(s.question || s.verb || s.label || '');

            // Description (below disc) — wrap to ~3 lines
            var detail = s.detail || s.description || '';
            var lines = wrapText(detail, 28);
            lines = lines.slice(0, 3);
            lines.forEach(function(ln, li) {
                g.append('text')
                    .attr('x', cx).attr('y', cy + nodeR + 26 + li * 15)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '11.5px')
                    .attr('fill', '#475569')
                    .text(ln);
            });

            // Timeline tick + label (below description)
            var tickY = cy + nodeR + 26 + 3 * 15 + 14;
            g.append('line')
                .attr('x1', cx).attr('y1', tickY - 4)
                .attr('x2', cx).attr('y2', tickY + 4)
                .attr('stroke', color).attr('stroke-width', 2);
            g.append('text')
                .attr('x', cx).attr('y', tickY + 18)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10px').attr('font-weight', '700')
                .attr('fill', color).attr('letter-spacing', '1.5px')
                .text(scaleLabels[i] || '');

            g.transition().delay(300 + i * 200).duration(400).style('opacity', 1);
        });

        // ─── Bottom timeline axis (framing "Right Now" commitment curve) ───
        var axisY = H - 120;
        svg.append('line')
            .attr('x1', margin.left).attr('x2', margin.left + plotW)
            .attr('y1', axisY).attr('y2', axisY)
            .attr('stroke', '#cbb995').attr('stroke-width', 1);

        svg.append('text')
            .attr('x', margin.left).attr('y', axisY - 10)
            .attr('font-size', '10px').attr('font-weight', '700')
            .attr('fill', '#94a3b8').attr('letter-spacing', '1.5px')
            .text('IMMEDIATE ACTION');
        svg.append('text')
            .attr('x', margin.left + plotW).attr('y', axisY - 10)
            .attr('text-anchor', 'end')
            .attr('font-size', '10px').attr('font-weight', '700')
            .attr('fill', '#b45309').attr('letter-spacing', '1.5px')
            .text('SUSTAINED IMPACT');

        // ─── Takeaway at bottom ───
        if (takeaway) {
            svg.append('text')
                .attr('x', W / 2).attr('y', H - 58)
                .attr('text-anchor', 'middle')
                .attr('font-size', '15px').attr('font-weight', '600').attr('fill', '#1a202c')
                .text(takeaway.text);
            if (takeaway.comment) {
                svg.append('text')
                    .attr('x', W / 2).attr('y', H - 32)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '12px').attr('font-style', 'italic').attr('fill', '#64748b')
                    .text(takeaway.comment);
            }
        }

        // Helper: simple word wrap by approximate character count
        function wrapText(text, maxChars) {
            var words = String(text).split(/\s+/);
            var lines = [];
            var cur = '';
            words.forEach(function(w) {
                if ((cur + ' ' + w).trim().length > maxChars) {
                    if (cur) lines.push(cur.trim());
                    cur = w;
                } else {
                    cur = (cur + ' ' + w).trim();
                }
            });
            if (cur) lines.push(cur);
            return lines;
        }
    }

    // ─── THE JIG (woodworker's metaphor, Tufte discipline) ───
    function jig(container, config) {
        var W = 1100, H = 560;
        var bg = '#faf7f1';                 // warm cream — wood-tone paper
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var wood = '#c9a574';
        var woodDark = '#8b5a2b';
        var redInk = '#a03a2e';             // "without" rail — historical
        var greenInk = '#4a7d3a';           // "with" rail — the new normal
        var amber = '#b45309';              // AI accent

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '82vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");

        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // ── Title & subtitle ──
        svg.append('text').attr('x', W / 2).attr('y', 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '23px').attr('font-weight', '700').attr('fill', ink)
            .text('The Jig');
        svg.append('text').attr('x', W / 2).attr('y', 66)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13.5px').attr('font-style', 'italic').attr('fill', muted)
            .text("Worth having. Historically never worth building. Until the threshold moved.");

        // ── Two panels ──
        var panelW = 470, panelH = 250, gap = 40;
        var leftX = (W - (2 * panelW + gap)) / 2;
        var rightX = leftX + panelW + gap;
        var panelY = 100;

        function panelFrame(x, label, sub, stroke) {
            svg.append('rect').attr('x', x).attr('y', panelY)
                .attr('width', panelW).attr('height', panelH)
                .attr('fill', 'none').attr('stroke', stroke).attr('stroke-width', 1)
                .attr('rx', 6);
            svg.append('text').attr('x', x + 18).attr('y', panelY + 28)
                .attr('font-size', '14px').attr('font-weight', '700').attr('fill', stroke)
                .attr('letter-spacing', '0.5px').text(label);
            svg.append('text').attr('x', x + 18).attr('y', panelY + 48)
                .attr('font-size', '11.5px').attr('fill', muted).text(sub);
        }

        panelFrame(leftX, 'WITHOUT A JIG', 'Each cut is eyeballed. The tool is hand, eye, memory.', redInk);
        panelFrame(rightX, 'WITH A JIG', 'Build the guide once. Every subsequent cut is identical, fast, defensible.', greenInk);

        // ── LEFT: four irregular cuts ──
        var piecesY = panelY + 80;
        var pW = 78, pH = 14;
        var variance = [0, -5, 3, -2];           // small, realistic variation
        var times = ['11m', '14m', '9m', '12m'];
        [0, 1, 2, 3].forEach(function(i) {
            var px = leftX + 32 + i * 100;
            svg.append('rect').attr('x', px).attr('y', piecesY)
                .attr('width', pW + variance[i]).attr('height', pH)
                .attr('fill', wood).attr('stroke', woodDark).attr('stroke-width', 1);
            // light grain
            svg.append('line').attr('x1', px + 2).attr('y1', piecesY + 5)
                .attr('x2', px + pW + variance[i] - 2).attr('y2', piecesY + 5)
                .attr('stroke', woodDark).attr('stroke-width', 0.3).attr('opacity', 0.4);
            svg.append('line').attr('x1', px + 2).attr('y1', piecesY + 10)
                .attr('x2', px + pW + variance[i] - 2).attr('y2', piecesY + 10)
                .attr('stroke', woodDark).attr('stroke-width', 0.3).attr('opacity', 0.4);
            svg.append('text').attr('x', px + (pW + variance[i]) / 2)
                .attr('y', piecesY + pH + 18)
                .attr('text-anchor', 'middle').attr('font-size', '10.5px').attr('fill', muted)
                .text(times[i]);
        });
        svg.append('text').attr('x', leftX + panelW / 2).attr('y', piecesY + 70)
            .attr('text-anchor', 'middle').attr('font-size', '11.5px').attr('font-style', 'italic').attr('fill', redInk)
            .text('4 pieces · 46 minutes · 4 different sizes.');
        svg.append('text').attr('x', leftX + panelW / 2).attr('y', piecesY + 115)
            .attr('text-anchor', 'middle').attr('font-size', '12.5px').attr('font-weight', '600').attr('fill', ink)
            .text('In research: each cohort extracted by hand, every time.');

        // ── RIGHT: jig + four identical cuts ──
        var jigX = rightX + 32;
        var jigY = piecesY - 6;

        // the jig itself — a precise template
        svg.append('rect').attr('x', jigX).attr('y', jigY)
            .attr('width', pW).attr('height', pH + 10)
            .attr('fill', woodDark).attr('stroke', '#3e2a11').attr('stroke-width', 1.5)
            .attr('rx', 2);
        svg.append('rect').attr('x', jigX + 6).attr('y', jigY + 4)
            .attr('width', pW - 12).attr('height', pH + 2)
            .attr('fill', bg).attr('stroke', '#3e2a11').attr('stroke-width', 0.8);
        svg.append('text').attr('x', jigX + pW / 2).attr('y', jigY - 6)
            .attr('text-anchor', 'middle').attr('font-size', '9.5px').attr('font-weight', '700')
            .attr('letter-spacing', '1px').attr('fill', '#3e2a11')
            .text('JIG');
        svg.append('text').attr('x', jigX + pW / 2).attr('y', jigY + pH + 34)
            .attr('text-anchor', 'middle').attr('font-size', '10.5px').attr('fill', muted)
            .text('48m to build');

        // arrow from jig to pieces
        svg.append('path')
            .attr('d', 'M ' + (jigX + pW + 4) + ' ' + (jigY + pH / 2) +
                       ' L ' + (jigX + pW + 22) + ' ' + (jigY + pH / 2))
            .attr('fill', 'none').attr('stroke', muted).attr('stroke-width', 1);
        svg.append('path')
            .attr('d', 'M ' + (jigX + pW + 22) + ' ' + (jigY + pH / 2) +
                       ' l -6,-3 l 0,6 z')
            .attr('fill', muted);

        // three identical pieces
        [0, 1, 2].forEach(function(i) {
            var px = jigX + pW + 40 + i * 95;
            svg.append('rect').attr('x', px).attr('y', piecesY)
                .attr('width', pW).attr('height', pH)
                .attr('fill', wood).attr('stroke', woodDark).attr('stroke-width', 1);
            svg.append('line').attr('x1', px + 2).attr('y1', piecesY + 5)
                .attr('x2', px + pW - 2).attr('y2', piecesY + 5)
                .attr('stroke', woodDark).attr('stroke-width', 0.3).attr('opacity', 0.4);
            svg.append('line').attr('x1', px + 2).attr('y1', piecesY + 10)
                .attr('x2', px + pW - 2).attr('y2', piecesY + 10)
                .attr('stroke', woodDark).attr('stroke-width', 0.3).attr('opacity', 0.4);
            svg.append('text').attr('x', px + pW / 2).attr('y', piecesY + pH + 18)
                .attr('text-anchor', 'middle').attr('font-size', '10.5px').attr('fill', greenInk)
                .text('2m');
        });
        svg.append('text').attr('x', rightX + panelW / 2).attr('y', piecesY + 70)
            .attr('text-anchor', 'middle').attr('font-size', '11.5px').attr('font-style', 'italic').attr('fill', greenInk)
            .text('48m (jig) + N × 2m cuts. Break-even at N = 6.');
        svg.append('text').attr('x', rightX + panelW / 2).attr('y', piecesY + 115)
            .attr('text-anchor', 'middle').attr('font-size', '12.5px').attr('font-weight', '600').attr('fill', ink)
            .text('In research: IBIS built once, every cohort after it is free.');

        // ── Break-even sparkline, Tufte style ──
        var chartY = panelY + panelH + 70;
        var chartH = 110;
        var chartX0 = leftX + 30;
        var chartX1 = rightX + panelW - 30;
        var chartMid = (chartX0 + chartX1) / 2;

        // x-axis (number of uses, n)
        var N = 20;
        var xs = d3.scaleLinear().domain([0, N]).range([chartX0, chartX1]);
        var ys = d3.scaleLinear().domain([0, 240]).range([chartY + chartH, chartY]);

        // without-jig line: cost = n * 12
        var withoutPath = d3.range(0, N + 1).map(function(n) { return { n: n, t: n * 12 }; });
        // with-jig line: cost = 48 + n * 2
        var withPath = d3.range(0, N + 1).map(function(n) { return { n: n, t: 48 + n * 2 }; });
        var lg = d3.line().x(function(d) { return xs(d.n); }).y(function(d) { return ys(d.t); });

        // axes (quiet Tufte rules)
        svg.append('line').attr('x1', chartX0).attr('x2', chartX1)
            .attr('y1', chartY + chartH).attr('y2', chartY + chartH)
            .attr('stroke', muted).attr('stroke-width', 0.5);

        svg.append('text').attr('x', chartX0 - 4).attr('y', chartY - 6)
            .attr('text-anchor', 'end')
            .attr('font-size', '10.5px').attr('fill', muted).attr('font-style', 'italic')
            .text('cumulative time (min)');
        svg.append('text').attr('x', chartX1).attr('y', chartY + chartH + 16)
            .attr('text-anchor', 'end')
            .attr('font-size', '10.5px').attr('fill', muted).attr('font-style', 'italic')
            .text('number of uses, N →');

        // without-jig line
        svg.append('path').datum(withoutPath).attr('d', lg)
            .attr('fill', 'none').attr('stroke', redInk).attr('stroke-width', 1.5);
        // with-jig line
        svg.append('path').datum(withPath).attr('d', lg)
            .attr('fill', 'none').attr('stroke', greenInk).attr('stroke-width', 1.5);

        // labels at the right edge
        svg.append('text').attr('x', chartX1 + 6)
            .attr('y', ys(withoutPath[N].t) + 3)
            .attr('font-size', '10.5px').attr('fill', redInk)
            .text('without a jig');
        svg.append('text').attr('x', chartX1 + 6)
            .attr('y', ys(withPath[N].t) + 3)
            .attr('font-size', '10.5px').attr('fill', greenInk)
            .text('with a jig');

        // break-even marker at N=6, t=72
        var beX = xs(6), beY = ys(72);
        svg.append('circle').attr('cx', beX).attr('cy', beY).attr('r', 3.5)
            .attr('fill', bg).attr('stroke', ink).attr('stroke-width', 1.3);
        svg.append('text').attr('x', beX).attr('y', beY - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('fill', ink).attr('font-style', 'italic')
            .text('break-even, N = 6');

        // threshold-of-buildability annotation
        var thY = chartY + chartH + 40;
        svg.append('text').attr('x', W / 2).attr('y', thY)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-weight', '700').attr('letter-spacing', '1.5px')
            .attr('fill', muted)
            .text('THE THRESHOLD OF BUILDABILITY');
        svg.append('text').attr('x', W / 2).attr('y', thY + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', ink)
            .text('For two decades most research jigs cost more than they saved. The curve sat above the threshold.');
        svg.append('text').attr('x', W / 2).attr('y', thY + 40)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-weight', '700').attr('fill', amber)
            .text('↓ AI-assisted development: the threshold fell by two orders of magnitude.');
    }

    // ─── DATA AS INVENTORY vs. DATA AS FLOW (lake vs. streams) ───
    function dataFlowVsInventory(container, config) {
        var W = 1200, H = 560;
        var bg = '#faf7f1';
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var lakeFill = '#4b5e6e';
        var lakeStroke = '#2f3d4a';
        var streamColor = '#3a7d4a';
        var streamAccent = '#22553a';
        var gateColor = '#8b5a2b';
        var crimson = '#a03a2e';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '86vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // Title
        svg.append('text').attr('x', W / 2).attr('y', 40)
            .attr('text-anchor', 'middle')
            .attr('font-size', '23px').attr('font-weight', '700').attr('fill', ink)
            .text('Data as Inventory  vs.  Data as Flow');
        svg.append('text').attr('x', W / 2).attr('y', 64)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', muted)
            .text("A lake is a pile; you cannot meaningfully audit a pile. A stream is narrow; the tap, the pipe, the destination are all inspectable.");

        // Two panels
        var panelW = 500, gap = 40;
        var leftX = (W - (2 * panelW + gap)) / 2;
        var rightX = leftX + panelW + gap;
        var panelY = 90;
        var panelH = 400;

        // ── LEFT: THE LAKE ──
        svg.append('text').attr('x', leftX + panelW / 2).attr('y', panelY + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700').attr('letter-spacing', '1.5px').attr('fill', lakeStroke)
            .text('THE LAKE \u2014 inventory thinking');
        svg.append('text').attr('x', leftX + panelW / 2).attr('y', panelY + 38)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text("\u201CCollect everything. Store it. Index it. Hope someone uses it.\u201D");

        // The lake — an irregular blob
        var lakeCX = leftX + panelW / 2;
        var lakeCY = panelY + 220;
        var lakePath = 'M ' + (lakeCX - 180) + ' ' + (lakeCY - 40) +
                       ' C ' + (lakeCX - 200) + ' ' + (lakeCY - 90) + ',' +
                              (lakeCX - 110) + ' ' + (lakeCY - 110) + ',' +
                              (lakeCX - 40) + ' ' + (lakeCY - 100) +
                       ' C ' + (lakeCX + 60) + ' ' + (lakeCY - 115) + ',' +
                              (lakeCX + 180) + ' ' + (lakeCY - 75) + ',' +
                              (lakeCX + 195) + ' ' + (lakeCY - 10) +
                       ' C ' + (lakeCX + 210) + ' ' + (lakeCY + 60) + ',' +
                              (lakeCX + 120) + ' ' + (lakeCY + 100) + ',' +
                              (lakeCX + 30) + ' ' + (lakeCY + 105) +
                       ' C ' + (lakeCX - 80) + ' ' + (lakeCY + 115) + ',' +
                              (lakeCX - 200) + ' ' + (lakeCY + 65) + ',' +
                              (lakeCX - 180) + ' ' + (lakeCY - 40) + ' Z';
        svg.append('path').attr('d', lakePath)
            .attr('fill', lakeFill).attr('fill-opacity', 0.25)
            .attr('stroke', lakeStroke).attr('stroke-width', 1.2);

        // Random data dots inside the lake (schema-less, undifferentiated)
        var dotRng = 0;
        function seedRand() { dotRng = (dotRng * 9301 + 49297) % 233280; return dotRng / 233280; }
        dotRng = 7;
        for (var di = 0; di < 140; di++) {
            var dx = lakeCX - 170 + seedRand() * 350;
            var dy = lakeCY - 90 + seedRand() * 185;
            // reject dots outside roughly-elliptical bounds
            var ex = (dx - lakeCX) / 185;
            var ey = (dy - lakeCY) / 100;
            if (ex * ex + ey * ey > 0.9) continue;
            svg.append('circle').attr('cx', dx).attr('cy', dy).attr('r', 1.3)
                .attr('fill', lakeStroke).attr('fill-opacity', 0.35);
        }

        // Gates around the lake (bureaucratic perimeter)
        var gatePositions = [
            { gx: lakeCX - 190, gy: lakeCY - 15 },
            { gx: lakeCX - 90,  gy: lakeCY - 108 },
            { gx: lakeCX + 80,  gy: lakeCY - 110 },
            { gx: lakeCX + 200, gy: lakeCY + 10 },
            { gx: lakeCX + 100, gy: lakeCY + 108 },
            { gx: lakeCX - 100, gy: lakeCY + 112 }
        ];
        gatePositions.forEach(function(g) {
            // small padlock-ish symbol
            svg.append('rect').attr('x', g.gx - 4).attr('y', g.gy - 4)
                .attr('width', 8).attr('height', 8).attr('rx', 1)
                .attr('fill', 'none').attr('stroke', gateColor).attr('stroke-width', 1.3);
            svg.append('path').attr('d', 'M ' + (g.gx - 2.5) + ' ' + (g.gy - 4) +
                                       ' a 2.5 2 0 0 1 5 0')
                .attr('fill', 'none').attr('stroke', gateColor).attr('stroke-width', 1.1);
        });

        // Analyst figures (the priesthood) on the shores
        function stickFigure(x, y, rod) {
            var g = svg.append('g');
            g.append('circle').attr('cx', x).attr('cy', y).attr('r', 3.5)
                .attr('fill', 'none').attr('stroke', ink).attr('stroke-width', 1);
            g.append('line').attr('x1', x).attr('x2', x).attr('y1', y + 3.5).attr('y2', y + 16)
                .attr('stroke', ink).attr('stroke-width', 1);
            g.append('line').attr('x1', x - 4).attr('x2', x + 4).attr('y1', y + 9).attr('y2', y + 9)
                .attr('stroke', ink).attr('stroke-width', 1);
            g.append('line').attr('x1', x).attr('x2', x - 3).attr('y1', y + 16).attr('y2', y + 23)
                .attr('stroke', ink).attr('stroke-width', 1);
            g.append('line').attr('x1', x).attr('x2', x + 3).attr('y1', y + 16).attr('y2', y + 23)
                .attr('stroke', ink).attr('stroke-width', 1);
            if (rod) {
                g.append('line').attr('x1', x + 4).attr('x2', x + rod.tx).attr('y1', y + 8).attr('y2', y + rod.ty)
                    .attr('stroke', muted).attr('stroke-width', 0.7);
            }
        }
        stickFigure(lakeCX - 220, lakeCY - 35, { tx: 36, ty: 40 });
        stickFigure(lakeCX + 215, lakeCY + 30, { tx: -40, ty: -10 });
        stickFigure(lakeCX - 60, lakeCY + 130, { tx: 30, ty: -28 });

        // Caption below the lake
        svg.append('text').attr('x', leftX + panelW / 2).attr('y', panelY + panelH - 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('fill', crimson)
            .text('Centralized data without contextual usability.');

        // ── RIGHT: THE STREAMS ──
        svg.append('text').attr('x', rightX + panelW / 2).attr('y', panelY + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700').attr('letter-spacing', '1.5px').attr('fill', streamAccent)
            .text('THE STREAMS \u2014 flow thinking');
        svg.append('text').attr('x', rightX + panelW / 2).attr('y', panelY + 38)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text("\u201CCapture the relevant slice at the point of generation. Security and audit baked in.\u201D");

        // Clinical event sources at the top
        var srcY = panelY + 68;
        var sources = [
            { x: rightX + 70,  label: 'HL7 orders' },
            { x: rightX + 170, label: 'path reports' },
            { x: rightX + 270, label: 'EHR vitals' },
            { x: rightX + 370, label: 'imaging' },
            { x: rightX + 450, label: 'consents' }
        ];
        sources.forEach(function(s) {
            // pulse dot
            svg.append('circle').attr('cx', s.x).attr('cy', srcY).attr('r', 4)
                .attr('fill', streamColor);
            svg.append('circle').attr('cx', s.x).attr('cy', srcY).attr('r', 8)
                .attr('fill', 'none').attr('stroke', streamColor).attr('stroke-opacity', 0.4).attr('stroke-width', 0.8);
            svg.append('text').attr('x', s.x).attr('y', srcY - 12)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10.5px').attr('fill', ink)
                .text(s.label);
        });

        // Purpose-built pools at the bottom
        var poolY = panelY + 300;
        var pools = [
            { cx: rightX + 100, label: 'biorepository', sources: [0, 1, 4] },
            { cx: rightX + 230, label: 'CHLOE',         sources: [1, 2, 3] },
            { cx: rightX + 360, label: 'BdHub',         sources: [0, 1, 4] },
            { cx: rightX + 460, label: 'IBIS index',    sources: [1] }
        ];
        pools.forEach(function(p) {
            // small rounded pool
            svg.append('rect').attr('x', p.cx - 42).attr('y', poolY)
                .attr('width', 84).attr('height', 32).attr('rx', 16)
                .attr('fill', streamColor).attr('fill-opacity', 0.15)
                .attr('stroke', streamAccent).attr('stroke-width', 1);
            svg.append('text').attr('x', p.cx).attr('y', poolY + 20)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11.5px').attr('font-weight', '700').attr('fill', streamAccent)
                .text(p.label);
        });

        // Draw streams from sources to pools with a tap on each stream
        pools.forEach(function(p) {
            p.sources.forEach(function(si) {
                var s = sources[si];
                var sx = s.x, sy = srcY + 6;
                var px = p.cx, py = poolY;
                // gentle cubic curve
                svg.append('path')
                    .attr('d', 'M ' + sx + ' ' + sy +
                               ' C ' + sx + ' ' + (sy + 80) + ',' +
                                       px + ' ' + (py - 80) + ',' +
                                       px + ' ' + py)
                    .attr('fill', 'none').attr('stroke', streamColor)
                    .attr('stroke-width', 1.4).attr('stroke-opacity', 0.7);
                // tap symbol midway
                var tapX = (sx + px) / 2 + (si - 1) * 5;
                var tapY = (sy + py) / 2;
                svg.append('rect').attr('x', tapX - 4).attr('y', tapY - 2)
                    .attr('width', 8).attr('height', 4)
                    .attr('fill', '#faf7f1').attr('stroke', streamAccent).attr('stroke-width', 0.8);
                svg.append('line').attr('x1', tapX).attr('x2', tapX).attr('y1', tapY - 2).attr('y2', tapY - 6)
                    .attr('stroke', streamAccent).attr('stroke-width', 0.8);
            });
        });

        // Caption below the streams
        svg.append('text').attr('x', rightX + panelW / 2).attr('y', panelY + panelH - 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('fill', streamAccent)
            .text('Each tap is narrow, audited, purpose-built. The pool fits the question.');

        // Bottom line — the argument
        svg.append('text').attr('x', W / 2).attr('y', H - 34)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14.5px').attr('font-weight', '700').attr('fill', ink)
            .text('The old paradigm was right in 2005, when building was the expensive part. That era ended.');
        svg.append('text').attr('x', W / 2).attr('y', H - 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('Streams are easier to audit than lakes. You control the tap, the pipe, and the destination.');
    }

    // ─── UNLOCKED ZONE — the band between two thresholds of buildability ───
    function unlockedZone(container, config) {
        var W = 1280, H = 760;
        var bg = '#faf7f1';
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var faded = '#a89c85';
        var amber = '#b45309';
        var amberLight = '#d4893e';
        var crimson = '#a03a2e';
        var green = '#4a7d3a';
        var slate = '#4b5e6e';
        var wood = '#8b5a2b';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '90vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // Title + subtitle
        svg.append('text').attr('x', W / 2).attr('y', 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '25px').attr('font-weight', '700').attr('fill', ink)
            .text('What Else Unlocks');
        svg.append('text').attr('x', W / 2).attr('y', 68)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', muted)
            .text('The jig, the clamps, the workbench \u2014 the band of tools that were always worth having, never worth building.');

        // ── Chart geometry ──
        var chartX0 = 80;
        var chartX1 = W - 80;
        var oldY = 130;          // old threshold line
        var newY = 455;          // new threshold line
        var bandTop = oldY;
        var bandBot = newY;

        // Y-axis label
        svg.append('text').attr('x', 40).attr('y', (oldY + newY) / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-weight', '700').attr('letter-spacing', '2px').attr('fill', muted)
            .attr('transform', 'rotate(-90 40 ' + (oldY + newY) / 2 + ')')
            .text('EFFORT TO BUILD  \u2191');

        // ── Shaded band = the unlocked zone ──
        svg.append('rect').attr('x', chartX0).attr('y', bandTop)
            .attr('width', chartX1 - chartX0).attr('height', bandBot - bandTop)
            .attr('fill', amber).attr('fill-opacity', 0.06);

        // ── Old threshold line (dashed, high) ──
        svg.append('line').attr('x1', chartX0).attr('x2', chartX1)
            .attr('y1', oldY).attr('y2', oldY)
            .attr('stroke', crimson).attr('stroke-width', 1.4).attr('stroke-dasharray', '6,4');
        svg.append('text').attr('x', chartX0).attr('y', oldY - 6)
            .attr('font-size', '11.5px').attr('font-weight', '700').attr('letter-spacing', '2px').attr('fill', crimson)
            .text('THRESHOLD OF BUILDABILITY \u00B7 2020');
        svg.append('text').attr('x', chartX1).attr('y', oldY - 6)
            .attr('text-anchor', 'end')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('above: always built \u2014 the main infrastructure (Epic \u00B7 REDCap \u00B7 data warehouse)');

        // ── New threshold line (solid, low) ──
        svg.append('line').attr('x1', chartX0).attr('x2', chartX1)
            .attr('y1', newY).attr('y2', newY)
            .attr('stroke', green).attr('stroke-width', 1.6);
        svg.append('text').attr('x', chartX0).attr('y', newY + 18)
            .attr('font-size', '11.5px').attr('font-weight', '700').attr('letter-spacing', '2px').attr('fill', green)
            .text('THRESHOLD OF BUILDABILITY \u00B7 2025');
        svg.append('text').attr('x', chartX1).attr('y', newY + 18)
            .attr('text-anchor', 'end')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('below: always trivial \u2014 a spreadsheet, a README, a sticky note');

        // ── Tools in the unlocked zone ──
        // Each tool = a small dot + label. Y distributed across 4 "rows" for legibility.
        var tools = [
            { x: 200,  y: 185, label: 'audit-trail replayer' },
            { x: 520,  y: 185, label: 'terminology reconciler' },
            { x: 880,  y: 185, label: 'query-reflection UI' },

            { x: 360,  y: 255, label: 'synthetic-name generator',     note: '(\u2192 Xenonym)' },
            { x: 700,  y: 255, label: 'adverse-event tracker' },
            { x: 1050, y: 255, label: 'site-specific dashboard' },

            { x: 200,  y: 325, label: 'HL7 stream monitor' },
            { x: 520,  y: 325, label: 'randomization helper' },
            { x: 880,  y: 325, label: 'provenance visualizer' },

            { x: 360,  y: 395, label: 'consent-form builder' },
            { x: 700,  y: 395, label: 'cohort-delta notifier' },
            { x: 1050, y: 395, label: 'inclusion-criteria explorer' }
        ];
        tools.forEach(function(t) {
            svg.append('circle').attr('cx', t.x).attr('cy', t.y).attr('r', 4)
                .attr('fill', amberLight).attr('stroke', amber).attr('stroke-width', 1.2);
            svg.append('text').attr('x', t.x + 10).attr('y', t.y + 4)
                .attr('font-size', '11.5px').attr('fill', ink).attr('fill-opacity', 0.85)
                .text(t.label);
            if (t.note) {
                svg.append('text').attr('x', t.x + 10).attr('y', t.y + 18)
                    .attr('font-size', '10px').attr('font-style', 'italic').attr('fill', muted)
                    .text(t.note);
            }
        });

        // ── "THE UNLOCKED ZONE" callout in the middle-right of the band ──
        svg.append('text').attr('x', chartX1 - 40).attr('y', bandTop + 30)
            .attr('text-anchor', 'end')
            .attr('font-size', '13px').attr('font-weight', '700').attr('letter-spacing', '3px').attr('fill', amber)
            .text('\u21E9  THE UNLOCKED ZONE');
        svg.append('text').attr('x', chartX1 - 40).attr('y', bandTop + 48)
            .attr('text-anchor', 'end')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text('always worth having \u2014 never worth building \u2014 now byproducts of the main work');

        // ── Callback to the jig slide ──
        svg.append('text').attr('x', chartX0 + 12).attr('y', bandBot - 16)
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', wood)
            .text('\u2190 same threshold the jig slide drew. This is what was living below it.');

        // ── Bottom: three main projects and their byproduct children ──
        var bY = 510;
        svg.append('line').attr('x1', 60).attr('x2', W - 60)
            .attr('y1', bY).attr('y2', bY)
            .attr('stroke', muted).attr('stroke-width', 0.5).attr('stroke-opacity', 0.5);
        svg.append('text').attr('x', W / 2).attr('y', bY + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('font-weight', '700').attr('letter-spacing', '2.5px').attr('fill', ink)
            .text('HOW BYPRODUCTS APPEAR');
        svg.append('text').attr('x', W / 2).attr('y', bY + 38)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text('the main project produces the jig; the jig gets reused across the team');

        var projects = [
            { x: 215, name: 'IBIS',  color: '#2e6da4',
              byp: ['query-reflection UI', 'synthetic-name generator', 'audit-trail replayer'] },
            { x: 640, name: 'CHLOE', color: '#ec4899',
              byp: ['inclusion-criteria explorer', 'cohort-delta notifier', 'site-specific dashboard'] },
            { x: 1065, name: 'BdHub', color: '#22c55e',
              byp: ['HL7 stream monitor', 'consent-form builder', 'provenance visualizer'] }
        ];
        projects.forEach(function(p) {
            // Main project node
            svg.append('rect').attr('x', p.x - 80).attr('y', bY + 60)
                .attr('width', 160).attr('height', 34).attr('rx', 4)
                .attr('fill', p.color).attr('fill-opacity', 0.14)
                .attr('stroke', p.color).attr('stroke-width', 1.5);
            svg.append('text').attr('x', p.x).attr('y', bY + 82)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px').attr('font-weight', '700').attr('letter-spacing', '1.5px')
                .attr('fill', p.color)
                .text(p.name);
            // Byproducts below, connected by a short line
            svg.append('line').attr('x1', p.x).attr('x2', p.x)
                .attr('y1', bY + 96).attr('y2', bY + 110)
                .attr('stroke', p.color).attr('stroke-width', 1).attr('stroke-opacity', 0.5);
            p.byp.forEach(function(b, i) {
                var byY = bY + 118 + i * 20;
                svg.append('text').attr('x', p.x).attr('y', byY)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '11px').attr('fill', ink).attr('fill-opacity', 0.75)
                    .text('\u00B7 ' + b);
            });
        });

        // ── Bottom takeaway ──
        svg.append('line').attr('x1', 80).attr('x2', W - 80)
            .attr('y1', H - 56).attr('y2', H - 56)
            .attr('stroke', amber).attr('stroke-width', 0.6).attr('stroke-opacity', 0.45);
        svg.append('text').attr('x', W / 2).attr('y', H - 34)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14.5px').attr('font-weight', '700').attr('fill', ink)
            .text('AI qualitatively transformed the cost of supplementary technologies.');
        svg.append('text').attr('x', W / 2).attr('y', H - 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', amber)
            .text('You get the jig and the clamps and the workbench \u2014 not just the cut.');
    }

    // ─── COMPRESSION STACK — what cannot be retrieved ───
    function compressionStack(container, config) {
        var W = 1280, H = 760;
        var bg = '#faf7f1';
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var amber = '#b45309';
        var crimson = '#a03a2e';
        var green = '#4a7d3a';
        var livedColor = '#b45309';       // warm amber — the lived encounter
        var memoryColor = '#8b5a2b';      // wood brown — the physician
        var recordColor = '#6b7c8f';      // clerical blue-gray — the record
        var llmColor = '#4b5e6e';         // slate — the LLM

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '92vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // Title + subtitle
        svg.append('text').attr('x', W / 2).attr('y', 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '25px').attr('font-weight', '700').attr('fill', ink)
            .text('What Cannot Be Retrieved');
        svg.append('text').attr('x', W / 2).attr('y', 68)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', muted)
            .text('Medicine has lived inside this problem for decades \u2014 through the medical record. We just didn\u2019t name it as compression.');

        // ── FOUR LEVELS OF COMPRESSION ──
        var levels = [
            { label: 'THE LIVED ENCOUNTER',
              sub: 'full fidelity \u00B7 present tense \u00B7 irreducible',
              detail: 'touch \u00B7 tone \u00B7 hesitation \u00B7 the body you saw suffering \u00B7 the silence before diagnosis',
              width: 980, color: livedColor },
            { label: "THE PHYSICIAN\u2019S JUDGMENT",
              sub: 'the compressed memory \u2014 still mortal',
              detail: 'pattern \u00B7 intuition \u00B7 tacit judgment \u00B7 ~450 weeks of compressed experience',
              width: 720, color: memoryColor },
            { label: 'THE MEDICAL RECORD',
              sub: 'the clerical residue \u2014 permanent, impoverished',
              detail: 'ICD \u00B7 RxNorm \u00B7 encounter notes \u00B7 the billing-workflow byproduct',
              width: 460, color: recordColor },
            { label: 'THE LLM ON RECORDS',
              sub: 'a compression of a compression',
              detail: 'learned from what the record already threw away',
              width: 250, color: llmColor }
        ];

        var levelH = 64;
        var gapBetween = 44;
        var stackStartY = 100;

        levels.forEach(function(L, i) {
            var y = stackStartY + i * (levelH + gapBetween);
            var x = (W - L.width) / 2;

            // Block
            svg.append('rect').attr('x', x).attr('y', y)
                .attr('width', L.width).attr('height', levelH)
                .attr('fill', L.color).attr('fill-opacity', 0.10)
                .attr('stroke', L.color).attr('stroke-width', 1.5)
                .attr('rx', 4);

            // Label
            svg.append('text').attr('x', W / 2).attr('y', y + 22)
                .attr('text-anchor', 'middle')
                .attr('font-size', '13px').attr('font-weight', '700').attr('letter-spacing', '2px')
                .attr('fill', L.color)
                .text(L.label);
            svg.append('text').attr('x', W / 2).attr('y', y + 40)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
                .text(L.sub);
            svg.append('text').attr('x', W / 2).attr('y', y + 56)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10.5px').attr('fill', ink).attr('fill-opacity', 0.75)
                .text(L.detail);

            // Arrow to next level (if not last)
            if (i < levels.length - 1) {
                var arrowY0 = y + levelH + 2;
                var arrowY1 = y + levelH + gapBetween - 6;
                svg.append('line').attr('x1', W / 2).attr('x2', W / 2)
                    .attr('y1', arrowY0).attr('y2', arrowY1)
                    .attr('stroke', muted).attr('stroke-width', 1.2);
                svg.append('path')
                    .attr('d', 'M ' + (W / 2) + ' ' + arrowY1 + ' l -5 -7 l 10 0 z')
                    .attr('fill', muted);
                svg.append('text').attr('x', W / 2 + 60).attr('y', (arrowY0 + arrowY1) / 2 + 4)
                    .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', muted)
                    .text('lossy compression');
            }
        });

        // ── Mortality line (between physician judgment and medical record) ──
        var mortalLineY = stackStartY + 2 * (levelH + gapBetween) - gapBetween / 2;
        svg.append('line').attr('x1', 60).attr('x2', W - 60)
            .attr('y1', mortalLineY).attr('y2', mortalLineY)
            .attr('stroke', crimson).attr('stroke-width', 0.9)
            .attr('stroke-dasharray', '6,4').attr('stroke-opacity', 0.65);
        svg.append('text').attr('x', W - 80).attr('y', mortalLineY - 6)
            .attr('text-anchor', 'end')
            .attr('font-size', '11px').attr('font-weight', '700').attr('letter-spacing', '2.5px').attr('fill', crimson)
            .text('MORTALITY LINE');
        svg.append('text').attr('x', 80).attr('y', mortalLineY - 6)
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', amber)
            .text('\u2191 passes with the person');
        svg.append('text').attr('x', 80).attr('y', mortalLineY + 18)
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', recordColor)
            .text('\u2193 persists indefinitely \u2014 but impoverished');

        // Right-margin fidelity anchors
        svg.append('text').attr('x', W - 50).attr('y', stackStartY + levelH / 2 + 2)
            .attr('text-anchor', 'end')
            .attr('font-size', '10.5px').attr('font-weight', '700').attr('letter-spacing', '1.5px').attr('fill', livedColor)
            .text('fidelity : FULL');
        svg.append('text').attr('x', W - 50).attr('y', stackStartY + 3 * (levelH + gapBetween) + levelH / 2 + 2)
            .attr('text-anchor', 'end')
            .attr('font-size', '10.5px').attr('font-weight', '700').attr('letter-spacing', '1.5px').attr('fill', llmColor)
            .text('fidelity : LOW');

        // ── Empirical-evidence + Yale quote panel ──
        var eY = stackStartY + levels.length * (levelH + gapBetween) + 20;
        svg.append('line').attr('x1', 80).attr('x2', W - 80)
            .attr('y1', eY - 14).attr('y2', eY - 14)
            .attr('stroke', muted).attr('stroke-width', 0.5).attr('stroke-opacity', 0.5);
        svg.append('text').attr('x', W / 2).attr('y', eY + 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13.5px').attr('font-weight', '700').attr('fill', green)
            .text('Empirical evidence:');
        svg.append('text').attr('x', W / 2).attr('y', eY + 26)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('fill', ink)
            .text('LLMs excel on full clinical vignettes. On real medical records, performance collapses.');
        svg.append('text').attr('x', W / 2).attr('y', eY + 44)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('Because the vignette keeps the nuance; the record has already thrown it away.');
        svg.append('text').attr('x', W / 2).attr('y', eY + 60)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('fill', muted)
            .text('Hager et al., Nature Medicine, 2024 \u00B7 2,400 real MIMIC cases \u00B7 LLMs significantly worse than physicians');

        // Yale Committee quote
        svg.append('text').attr('x', W / 2).attr('y', eY + 90)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', crimson)
            .text('\u201CDeclining public trust in the very idea of human expertise.\u201D');
        svg.append('text').attr('x', W / 2).attr('y', eY + 106)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('fill', muted)
            .text('\u2014 Yale Committee on Trust in Higher Education, April 10, 2026');

        // ── Bottom takeaway ──
        svg.append('line').attr('x1', 80).attr('x2', W - 80)
            .attr('y1', H - 56).attr('y2', H - 56)
            .attr('stroke', amber).attr('stroke-width', 0.6).attr('stroke-opacity', 0.45);
        svg.append('text').attr('x', W / 2).attr('y', H - 34)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14.5px').attr('font-weight', '700').attr('fill', ink)
            .text('The knowledge is retrievable. The lived experience it compressed from is not.');
        svg.append('text').attr('x', W / 2).attr('y', H - 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('font-style', 'italic').attr('fill', amber)
            .text('The \u201Cdeath of expertise\u201D is actually misplaced trust in our compressions.');
    }

    // ─── TWO ORDERS OF MAGNITUDE — the redistribution, with discipline as hinge ───
    function twoOrdersShift(container, config) {
        var W = 1280, H = 700;
        var bg = '#faf7f1';
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var faded = '#a89c85';
        var amber = '#b45309';
        var crimson = '#a03a2e';
        var green = '#4a7d3a';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '90vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // Title + subtitle
        svg.append('text').attr('x', W / 2).attr('y', 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '25px').attr('font-weight', '700').attr('fill', ink)
            .text('What AI Changed \u2014 Two Orders of Magnitude');
        svg.append('text').attr('x', W / 2).attr('y', 70)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', muted)
            .text('Not a uniform reduction. A redistribution of effort \u2014 with discipline as the hinge.');

        // ── Two columns: absorbed / amplified ──
        var absorbedX = 300;
        var amplifiedX = W - 300;
        var headerY = 125;

        svg.append('text').attr('x', absorbedX).attr('y', headerY)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700').attr('letter-spacing', '2.5px').attr('fill', faded)
            .text('ABSORBED BY AI');
        svg.append('text').attr('x', absorbedX).attr('y', headerY + 18)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text('mechanical \u00B7 repeatable \u00B7 well-solved');

        svg.append('text').attr('x', amplifiedX).attr('y', headerY)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700').attr('letter-spacing', '2.5px').attr('fill', green)
            .text('AMPLIFIED FOR HUMANS');
        svg.append('text').attr('x', amplifiedX).attr('y', headerY + 18)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text('intellectual \u00B7 judgment \u00B7 domain-specific');

        var absorbedItems = [
            'boilerplate',
            'syntax lookup',
            'framework config',
            'scaffolding',
            'CRUD endpoints',
            'documentation drafts',
            'test skeletons',
            'debugging mechanics'
        ];
        var amplifiedItems = [
            'architectural judgment',
            'security thinking',
            'risk analysis',
            'validation &amp; tests',
            'domain focus',
            'clinical reasoning',
            'user empathy',
            'design intent'
        ];

        var itemStartY = headerY + 62;
        var itemGap = 30;

        absorbedItems.forEach(function(item, i) {
            var yy = itemStartY + i * itemGap;
            svg.append('text').attr('x', absorbedX - 110).attr('y', yy + 4)
                .attr('text-anchor', 'middle')
                .attr('font-size', '13px').attr('fill', faded)
                .text('\u2193');
            svg.append('text').attr('x', absorbedX).attr('y', yy + 4)
                .attr('text-anchor', 'middle')
                .attr('font-size', '13px').attr('fill', faded).attr('font-style', 'italic')
                .attr('text-decoration', 'line-through')
                .text(item);
        });

        amplifiedItems.forEach(function(item, i) {
            var yy = itemStartY + i * itemGap;
            svg.append('text').attr('x', amplifiedX - 120).attr('y', yy + 4)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px').attr('font-weight', '700').attr('fill', green)
                .text('\u2191');
            svg.append('text').attr('x', amplifiedX).attr('y', yy + 4)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px').attr('font-weight', '600').attr('fill', ink)
                .html(item);
        });

        // ── Center pivot: 100× label ──
        var divY0 = itemStartY - 44;
        var divY1 = itemStartY + absorbedItems.length * itemGap - 10;
        // Soft vertical guide
        svg.append('line').attr('x1', W / 2).attr('x2', W / 2)
            .attr('y1', divY0 + 30).attr('y2', divY1)
            .attr('stroke', muted).attr('stroke-width', 0.5).attr('stroke-opacity', 0.35);

        // REDISTRIBUTION banner on top
        svg.append('text').attr('x', W / 2).attr('y', divY0 + 14)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-weight', '700').attr('letter-spacing', '2.5px').attr('fill', amber)
            .text('\u2190  REDISTRIBUTION  \u2192');

        // 100× figure at the center
        var centerY = (divY0 + divY1) / 2;
        svg.append('text').attr('x', W / 2).attr('y', centerY - 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '44px').attr('font-weight', '300').attr('fill', amber)
            .text('100\u00D7');
        svg.append('text').attr('x', W / 2).attr('y', centerY + 22)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text('less effort');
        svg.append('text').attr('x', W / 2).attr('y', centerY + 62)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('fill', ink).attr('fill-opacity', 0.75)
            .text('same gates');
        svg.append('text').attr('x', W / 2).attr('y', centerY + 78)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('fill', ink).attr('fill-opacity', 0.75)
            .text('same quality bar');

        // ── Bottom: the discipline hinge ──
        var forkY = itemStartY + absorbedItems.length * itemGap + 30;
        svg.append('line').attr('x1', 60).attr('x2', W - 60)
            .attr('y1', forkY - 16).attr('y2', forkY - 16)
            .attr('stroke', muted).attr('stroke-width', 0.5).attr('stroke-opacity', 0.5);
        svg.append('text').attr('x', W / 2).attr('y', forkY + 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-weight', '700').attr('letter-spacing', '2.5px').attr('fill', ink)
            .text('THE DISCIPLINE HINGE');

        var panelW = (W - 180) / 2;
        var panelY = forkY + 24;
        var panelH = 96;

        // Without discipline (crimson)
        svg.append('rect').attr('x', 60).attr('y', panelY)
            .attr('width', panelW).attr('height', panelH)
            .attr('fill', crimson).attr('fill-opacity', 0.08)
            .attr('stroke', crimson).attr('stroke-width', 1.2).attr('rx', 4);
        svg.append('text').attr('x', 60 + panelW / 2).attr('y', panelY + 26)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700').attr('letter-spacing', '2px').attr('fill', crimson)
            .text('WITHOUT DISCIPLINE');
        svg.append('text').attr('x', 60 + panelW / 2).attr('y', panelY + 48)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('fill', ink)
            .text('AI drift \u00B7 plausible wrong answers \u00B7');
        svg.append('text').attr('x', 60 + panelW / 2).attr('y', panelY + 66)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('fill', ink)
            .text('mistakes compound at the new speed');
        svg.append('text').attr('x', 60 + panelW / 2).attr('y', panelY + 86)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', crimson)
            .text('the 100\u00D7 does not apply');

        // With discipline (green)
        svg.append('rect').attr('x', W - 60 - panelW).attr('y', panelY)
            .attr('width', panelW).attr('height', panelH)
            .attr('fill', green).attr('fill-opacity', 0.08)
            .attr('stroke', green).attr('stroke-width', 1.2).attr('rx', 4);
        svg.append('text').attr('x', W - 60 - panelW / 2).attr('y', panelY + 26)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700').attr('letter-spacing', '2px').attr('fill', green)
            .text('WITH DISCIPLINE');
        svg.append('text').attr('x', W - 60 - panelW / 2).attr('y', panelY + 48)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('fill', ink)
            .text('same quality gates \u00B7 auditable artifacts \u00B7');
        svg.append('text').attr('x', W - 60 - panelW / 2).attr('y', panelY + 66)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('fill', ink)
            .text('regulated-grade software');
        svg.append('text').attr('x', W - 60 - panelW / 2).attr('y', panelY + 86)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', green)
            .text('100\u00D7 less effort at the same standard');

        // ── Bottom takeaway ──
        svg.append('line').attr('x1', 60).attr('x2', W - 60)
            .attr('y1', H - 46).attr('y2', H - 46)
            .attr('stroke', amber).attr('stroke-width', 0.6).attr('stroke-opacity', 0.45);
        svg.append('text').attr('x', W / 2).attr('y', H - 22)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700').attr('fill', ink)
            .text('The shift isn\u2019t less work. It\u2019s different work \u2014 and the discipline is the part that didn\u2019t change.');
    }

    // ─── THE QUESTION RETURNS — Answerer vs. Interlocutor ───
    function questionReturns(container, config) {
        var W = 1280, H = 700;
        var bg = '#faf7f1';
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var amber = '#b45309';
        var crimson = '#a03a2e';
        var green = '#4a7d3a';
        var answererC = '#5a4a6a';           // somber purple-gray — the silent oracle
        var interlocutorC = '#2e6da4';       // conversational blue
        var questionerC = '#8b5a2b';          // warm brown — human

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '90vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // Small helper: draw a stick figure whose head is at (x, y-16)
        function stickFigure(parent, x, y, color) {
            parent.append('circle').attr('cx', x).attr('cy', y - 16).attr('r', 6)
                .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1.5);
            parent.append('line').attr('x1', x).attr('x2', x).attr('y1', y - 10).attr('y2', y + 12)
                .attr('stroke', color).attr('stroke-width', 1.5);
            parent.append('line').attr('x1', x - 10).attr('x2', x + 10).attr('y1', y).attr('y2', y)
                .attr('stroke', color).attr('stroke-width', 1.5);
            parent.append('line').attr('x1', x).attr('x2', x - 7).attr('y1', y + 12).attr('y2', y + 22)
                .attr('stroke', color).attr('stroke-width', 1.5);
            parent.append('line').attr('x1', x).attr('x2', x + 7).attr('y1', y + 12).attr('y2', y + 22)
                .attr('stroke', color).attr('stroke-width', 1.5);
        }

        // Title + subtitle
        svg.append('text').attr('x', W / 2).attr('y', 44)
            .attr('text-anchor', 'middle')
            .attr('font-size', '26px').attr('font-weight', '700').attr('fill', ink)
            .text('The Question Returns');
        svg.append('text').attr('x', W / 2).attr('y', 72)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', muted)
            .text('Sheckley\u2019s Answerer was condemned to silence. What we build now is different \u2014 if the questioner arrives prepared.');

        // Layout
        var panelY = 110;
        var panelH = 340;

        // ═════ LEFT PANEL: THE ANSWERER ═════
        var lx0 = 70, lx1 = 610;
        svg.append('text').attr('x', (lx0 + lx1) / 2).attr('y', panelY - 14)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-weight', '700').attr('letter-spacing', '2.5px')
            .attr('fill', answererC)
            .text('THE ANSWERER');
        svg.append('text').attr('x', (lx0 + lx1) / 2).attr('y', panelY + 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text('Sheckley\u2019s original \u2014 the oracle');

        svg.append('rect').attr('x', lx0).attr('y', panelY + 22)
            .attr('width', lx1 - lx0).attr('height', panelH - 22)
            .attr('fill', 'none').attr('stroke', answererC).attr('stroke-width', 1)
            .attr('stroke-dasharray', '6,4').attr('rx', 4);

        // Questioner on the left
        var lqx = lx0 + 70, lqy = panelY + 170;
        stickFigure(svg, lqx, lqy, questionerC);
        svg.append('text').attr('x', lqx).attr('y', lqy + 40)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('fill', muted).text('questioner');

        // Answerer box
        var aBoxX = lx0 + 260, aBoxY = panelY + 115, aBoxW = 220, aBoxH = 110;
        svg.append('rect').attr('x', aBoxX).attr('y', aBoxY)
            .attr('width', aBoxW).attr('height', aBoxH)
            .attr('fill', answererC).attr('fill-opacity', 0.14)
            .attr('stroke', answererC).attr('stroke-width', 1.8)
            .attr('rx', 4);
        // a single closed "slit" — suggesting an inlet but no dialogue surface
        svg.append('line').attr('x1', aBoxX + 40).attr('x2', aBoxX + aBoxW - 40)
            .attr('y1', aBoxY + aBoxH - 18).attr('y2', aBoxY + aBoxH - 18)
            .attr('stroke', answererC).attr('stroke-width', 2);
        svg.append('text').attr('x', aBoxX + aBoxW / 2).attr('y', aBoxY + aBoxH / 2 + 8)
            .attr('text-anchor', 'middle')
            .attr('font-size', '46px').attr('font-weight', '300').attr('fill', answererC)
            .text('?');

        // One-way arrow: ask
        svg.append('line').attr('x1', lqx + 14).attr('y1', lqy - 4)
            .attr('x2', aBoxX - 10).attr('y2', aBoxY + aBoxH / 2 - 10)
            .attr('stroke', answererC).attr('stroke-width', 1.5);
        svg.append('path').attr('d',
                'M ' + (aBoxX - 10) + ' ' + (aBoxY + aBoxH / 2 - 10) +
                ' l -8 -3 l 2 7 z')
            .attr('fill', answererC);
        svg.append('text').attr('x', (lqx + aBoxX) / 2 + 20).attr('y', lqy - 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', answererC)
            .text('ask  (once)');

        // Return arrow — dashed, broken, crimson = silence or wrong answer
        svg.append('path').attr('d',
                'M ' + (aBoxX - 10) + ' ' + (aBoxY + aBoxH / 2 + 20) +
                ' L ' + (lqx + 20) + ' ' + (lqy + 18))
            .attr('fill', 'none').attr('stroke', crimson).attr('stroke-width', 1.2)
            .attr('stroke-dasharray', '3,3').attr('stroke-opacity', 0.75);
        svg.append('path').attr('d',
                'M ' + (lqx + 20) + ' ' + (lqy + 18) + ' l 8 -2 l -2 6 z')
            .attr('fill', crimson).attr('fill-opacity', 0.75);
        svg.append('text').attr('x', (lqx + aBoxX) / 2 + 20).attr('y', lqy + 63)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', crimson)
            .text('silence \u2014 or a plausible wrong answer');

        // Bottom caption
        svg.append('text').attr('x', (lx0 + lx1) / 2).attr('y', panelY + panelH - 34)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', ink)
            .text('\u201CIn order to ask a question');
        svg.append('text').attr('x', (lx0 + lx1) / 2).attr('y', panelY + panelH - 16)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', ink)
            .text('you must already know most of the answer.\u201D');

        // ═════ RIGHT PANEL: THE INTERLOCUTOR ═════
        var rx0 = 670, rx1 = 1210;
        svg.append('text').attr('x', (rx0 + rx1) / 2).attr('y', panelY - 14)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-weight', '700').attr('letter-spacing', '2.5px')
            .attr('fill', interlocutorC)
            .text('THE INTERLOCUTOR');
        svg.append('text').attr('x', (rx0 + rx1) / 2).attr('y', panelY + 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text('MCP servers \u00B7 interactive IDEs \u2014 learning tools; one of many');

        svg.append('rect').attr('x', rx0).attr('y', panelY + 22)
            .attr('width', rx1 - rx0).attr('height', panelH - 22)
            .attr('fill', 'none').attr('stroke', interlocutorC).attr('stroke-width', 1)
            .attr('rx', 4);

        // Questioner
        var rqx = rx0 + 70, rqy = panelY + 170;
        stickFigure(svg, rqx, rqy, questionerC);
        svg.append('text').attr('x', rqx).attr('y', rqy + 40)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('fill', muted).text('questioner');

        // Chat-style Interlocutor — a box containing alternating bubbles
        var iBoxX = rx0 + 240, iBoxY = panelY + 85, iBoxW = 240, iBoxH = 165;
        svg.append('rect').attr('x', iBoxX).attr('y', iBoxY)
            .attr('width', iBoxW).attr('height', iBoxH)
            .attr('fill', interlocutorC).attr('fill-opacity', 0.08)
            .attr('stroke', interlocutorC).attr('stroke-width', 1.8)
            .attr('rx', 6);
        // Five chat bubbles alternating left/right, converging toward a green success at bottom
        var bubbles = [
            { x: iBoxX + 14, y: iBoxY + 14, w: 150, h: 14, color: interlocutorC, op: 0.32, label: '' },
            { x: iBoxX + iBoxW - 164, y: iBoxY + 36, w: 150, h: 14, color: interlocutorC, op: 0.18, label: '' },
            { x: iBoxX + 14, y: iBoxY + 58, w: 120, h: 14, color: interlocutorC, op: 0.32, label: '' },
            { x: iBoxX + iBoxW - 134, y: iBoxY + 80, w: 120, h: 14, color: interlocutorC, op: 0.18, label: '' },
            { x: iBoxX + 14, y: iBoxY + 102, w: 90,  h: 14, color: interlocutorC, op: 0.32, label: '' },
            { x: iBoxX + 14, y: iBoxY + 128, w: 80,  h: 18, color: green, op: 0.45, label: '' }
        ];
        bubbles.forEach(function(b) {
            svg.append('rect').attr('x', b.x).attr('y', b.y)
                .attr('width', b.w).attr('height', b.h).attr('rx', b.h / 2)
                .attr('fill', b.color).attr('fill-opacity', b.op);
        });
        // converge marker (small "✓" near the final green bubble)
        svg.append('path').attr('d',
                'M ' + (iBoxX + 102) + ' ' + (iBoxY + 140) +
                ' l 5 5 l 11 -11')
            .attr('fill', 'none').attr('stroke', green).attr('stroke-width', 2)
            .attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');

        // Two-way arrows between questioner and interlocutor (curved, labeled)
        // ask
        svg.append('path').attr('d',
                'M ' + (rqx + 14) + ' ' + (rqy - 12) +
                ' Q ' + ((rqx + iBoxX) / 2 + 5) + ' ' + (rqy - 40) + ' ' +
                       (iBoxX - 5) + ' ' + (iBoxY + 25))
            .attr('fill', 'none').attr('stroke', interlocutorC).attr('stroke-width', 1.4);
        svg.append('path').attr('d',
                'M ' + (iBoxX - 5) + ' ' + (iBoxY + 25) + ' l -8 -2 l 3 6 z')
            .attr('fill', interlocutorC);
        svg.append('text').attr('x', (rqx + iBoxX) / 2 + 5).attr('y', rqy - 52)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', interlocutorC)
            .text('ask');
        // reflect
        svg.append('path').attr('d',
                'M ' + (iBoxX - 5) + ' ' + (iBoxY + 55) +
                ' Q ' + ((rqx + iBoxX) / 2 - 5) + ' ' + (rqy - 6) + ' ' +
                       (rqx + 14) + ' ' + (rqy + 4))
            .attr('fill', 'none').attr('stroke', interlocutorC).attr('stroke-width', 1.4);
        svg.append('path').attr('d',
                'M ' + (rqx + 14) + ' ' + (rqy + 4) + ' l 6 -3 l 0 7 z')
            .attr('fill', interlocutorC);
        svg.append('text').attr('x', (rqx + iBoxX) / 2 - 5).attr('y', rqy + 14)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', interlocutorC)
            .text('reflect');
        // refine (second loop, lower)
        svg.append('path').attr('d',
                'M ' + (rqx + 14) + ' ' + (rqy + 20) +
                ' Q ' + ((rqx + iBoxX) / 2 + 5) + ' ' + (rqy + 56) + ' ' +
                       (iBoxX - 5) + ' ' + (iBoxY + iBoxH - 30))
            .attr('fill', 'none').attr('stroke', interlocutorC).attr('stroke-width', 1.4);
        svg.append('path').attr('d',
                'M ' + (iBoxX - 5) + ' ' + (iBoxY + iBoxH - 30) + ' l -8 -2 l 3 6 z')
            .attr('fill', interlocutorC);
        svg.append('text').attr('x', (rqx + iBoxX) / 2 + 10).attr('y', rqy + 64)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', interlocutorC)
            .text('refine \u2192 converge');

        // Bottom caption
        svg.append('text').attr('x', (rx0 + rx1) / 2).attr('y', panelY + panelH - 34)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', ink)
            .text('The tool meets her where she is');
        svg.append('text').attr('x', (rx0 + rx1) / 2).attr('y', panelY + panelH - 16)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', ink)
            .text('\u2014 and helps her converge on the question.');

        // ═════ THE QUESTIONER strip ═════
        var bY = 500;
        svg.append('line').attr('x1', 60).attr('x2', W - 60)
            .attr('y1', bY - 14).attr('y2', bY - 14)
            .attr('stroke', muted).attr('stroke-width', 0.5).attr('stroke-opacity', 0.5);
        svg.append('text').attr('x', W / 2).attr('y', bY + 4)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-weight', '700').attr('letter-spacing', '2.5px').attr('fill', questionerC)
            .text('THE QUESTIONER');
        svg.append('text').attr('x', W / 2).attr('y', bY + 26)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', ink)
            .text('arrives prepared \u00B7 brings the question \u00B7 expects both revelation AND disappointment');

        // Two outcome labels flanking
        svg.append('text').attr('x', 290).attr('y', bY + 62)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700').attr('fill', green)
            .text('\u2734  revelation');
        svg.append('text').attr('x', 290).attr('y', bY + 82)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('when the question is ripe, and heard');

        svg.append('text').attr('x', W - 290).attr('y', bY + 62)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700').attr('fill', crimson)
            .text('\u2718  disappointment');
        svg.append('text').attr('x', W - 290).attr('y', bY + 82)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('when it is not \u2014 that is still information');

        // Bottom takeaway
        svg.append('line').attr('x1', 60).attr('x2', W - 60)
            .attr('y1', H - 72).attr('y2', H - 72)
            .attr('stroke', amber).attr('stroke-width', 0.6).attr('stroke-opacity', 0.45);
        svg.append('text').attr('x', W / 2).attr('y', H - 46)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px').attr('font-weight', '700').attr('fill', ink)
            .text('That is the difference between an Answerer that fails and an instrument of scientific inquiry that succeeds.');
        svg.append('text').attr('x', W / 2).attr('y', H - 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', amber)
            .text('Bring the question. Expect the revelation. Accept the disappointment. Keep asking.');
    }

    // ─── THE ASK — five careful moves, each under a loupe ───
    function theAskFiveLoupes(container, config) {
        var W = 1280, H = 640;
        var bg = '#faf7f1';
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var amber = '#b45309';
        var crimson = '#a03a2e';
        var green = '#4a7d3a';
        var brass = '#b8865b';
        var wood = '#8b5a2b';
        var woodDark = '#3e2a11';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '90vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // Title + subtitle
        svg.append('text').attr('x', W / 2).attr('y', 24)
            .attr('text-anchor', 'middle')
            .attr('font-size', '26px').attr('font-weight', '700').attr('fill', ink)
            .text('The Opening');
        svg.append('text').attr('x', W / 2).attr('y', 54)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', muted)
            .text('The work is already underway. The request is not permission \u2014 it is fair evaluation, institutional recognition, and a path to make the capability durable.');

        // Five stations
        var stations = [
            { verb: 'EVALUATE',  phrase: 'judge by evidence, not origin',         color: '#2e6da4', sym: 'doc-check' },
            { verb: 'RECOGNIZE', phrase: 'as institutional intellectual work',    color: '#8b4a9a', sym: 'stamp' },
            { verb: 'HARDEN',    phrase: 'security \u00B7 validation \u00B7 audit', color: '#a03a2e', sym: 'shield' },
            { verb: 'ADOPT',     phrase: 'shared service \u00B7 SSO \u00B7 governance', color: '#4a7d3a', sym: 'gears' },
            { verb: 'PUBLISH',   phrase: 'methods paper \u00B7 reusable pattern',  color: '#b45309', sym: 'globe' }
        ];

        var cy = 210;
        var lensR = 50;
        var spacing = 250;
        var startX = 130;

        function drawLensSymbol(g, cx, cy, sym, color) {
            if (sym === 'doc-check') {
                g.append('rect').attr('x', cx - 16).attr('y', cy - 19).attr('width', 28).attr('height', 34)
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2).attr('rx', 2);
                // header line
                g.append('line').attr('x1', cx - 11).attr('y1', cy - 13).attr('x2', cx + 5).attr('y2', cy - 13)
                    .attr('stroke', color).attr('stroke-width', 1.2);
                // check
                g.append('path').attr('d', 'M ' + (cx - 9) + ' ' + (cy + 3) + ' L ' + (cx - 2) + ' ' + (cy + 10) + ' L ' + (cx + 10) + ' ' + (cy - 5))
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.5)
                    .attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');
            } else if (sym === 'stamp') {
                // Round certified stamp: two concentric rings, tick marks between, checkmark at center
                g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 20)
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.5);
                g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 13)
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1.3);
                for (var i = 0; i < 8; i++) {
                    var tAng = (i / 8) * 2 * Math.PI + Math.PI / 16;
                    g.append('line')
                        .attr('x1', cx + Math.cos(tAng) * 14).attr('y1', cy + Math.sin(tAng) * 14)
                        .attr('x2', cx + Math.cos(tAng) * 19).attr('y2', cy + Math.sin(tAng) * 19)
                        .attr('stroke', color).attr('stroke-width', 0.9);
                }
                g.append('path').attr('d',
                        'M ' + (cx - 6) + ' ' + cy +
                        ' L ' + (cx - 1) + ' ' + (cy + 5) +
                        ' L ' + (cx + 7) + ' ' + (cy - 5))
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.2)
                    .attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');
            } else if (sym === 'gears') {
                // Two meshed gears: smaller upper-left, larger lower-right
                function drawGear(gx, gy, gr, teeth) {
                    g.append('circle').attr('cx', gx).attr('cy', gy).attr('r', gr)
                        .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1.8);
                    for (var ti = 0; ti < teeth; ti++) {
                        var gAng = (ti / teeth) * 2 * Math.PI;
                        g.append('line')
                            .attr('x1', gx + Math.cos(gAng) * gr)
                            .attr('y1', gy + Math.sin(gAng) * gr)
                            .attr('x2', gx + Math.cos(gAng) * (gr + 3))
                            .attr('y2', gy + Math.sin(gAng) * (gr + 3))
                            .attr('stroke', color).attr('stroke-width', 2.2)
                            .attr('stroke-linecap', 'round');
                    }
                    g.append('circle').attr('cx', gx).attr('cy', gy).attr('r', gr * 0.32)
                        .attr('fill', color).attr('fill-opacity', 0.22)
                        .attr('stroke', color).attr('stroke-width', 1);
                }
                drawGear(cx - 8, cy - 4, 7, 8);
                drawGear(cx + 9, cy + 5, 9, 10);
            } else if (sym === 'ripples') {
                // Water ripples spreading outward from a central drop
                g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 6)
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2);
                g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 12)
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1.5).attr('stroke-opacity', 0.7);
                g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 18)
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1).attr('stroke-opacity', 0.4);
                g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 24)
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 0.8).attr('stroke-opacity', 0.22);
                g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 2.5).attr('fill', color);
            } else if (sym === 'shield') {
                // Heater shield outline with central divider + checkmark inside
                g.append('path').attr('d',
                        'M ' + (cx - 17) + ' ' + (cy - 17) +
                        ' L ' + (cx + 17) + ' ' + (cy - 17) +
                        ' L ' + (cx + 17) + ' ' + (cy - 4) +
                        ' Q ' + (cx + 17) + ' ' + (cy + 9) + ' ' + cx + ' ' + (cy + 19) +
                        ' Q ' + (cx - 17) + ' ' + (cy + 9) + ' ' + (cx - 17) + ' ' + (cy - 4) +
                        ' Z')
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2);
                // Subtle vertical divider
                g.append('line').attr('x1', cx).attr('y1', cy - 17).attr('x2', cx).attr('y2', cy + 14)
                    .attr('stroke', color).attr('stroke-width', 1).attr('stroke-opacity', 0.45);
                // Checkmark — validation lives inside hardening
                g.append('path').attr('d',
                        'M ' + (cx - 7) + ' ' + cy +
                        ' L ' + (cx - 2) + ' ' + (cy + 5) +
                        ' L ' + (cx + 8) + ' ' + (cy - 5))
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.2)
                    .attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round');
            } else if (sym === 'globe') {
                // Globe: sphere outline, equator, meridians, latitudes
                g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 18)
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2);
                g.append('line').attr('x1', cx - 18).attr('y1', cy).attr('x2', cx + 18).attr('y2', cy)
                    .attr('stroke', color).attr('stroke-width', 1.3);
                g.append('path').attr('d', 'M ' + cx + ' ' + (cy - 18) + ' Q ' + (cx + 10) + ' ' + cy + ' ' + cx + ' ' + (cy + 18))
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1);
                g.append('path').attr('d', 'M ' + cx + ' ' + (cy - 18) + ' Q ' + (cx - 10) + ' ' + cy + ' ' + cx + ' ' + (cy + 18))
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1);
                g.append('path').attr('d', 'M ' + (cx - 15) + ' ' + (cy - 9) + ' Q ' + cx + ' ' + (cy - 6) + ' ' + (cx + 15) + ' ' + (cy - 9))
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1).attr('stroke-opacity', 0.7);
                g.append('path').attr('d', 'M ' + (cx - 15) + ' ' + (cy + 9) + ' Q ' + cx + ' ' + (cy + 6) + ' ' + (cx + 15) + ' ' + (cy + 9))
                    .attr('fill', 'none').attr('stroke', color).attr('stroke-width', 1).attr('stroke-opacity', 0.7);
            }
        }

        stations.forEach(function(s, i) {
            var cx = startX + i * spacing;
            var g = svg.append('g')
                .attr('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.14))');

            // Station number (above)
            g.append('text').attr('x', cx).attr('y', cy - lensR - 14)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11px').attr('font-weight', '700').attr('letter-spacing', '2.5px')
                .attr('fill', muted)
                .text(String(i + 1));

            // Handle (wood) — drawn first so ring overlaps base
            g.append('line').attr('x1', cx + 37).attr('y1', cy + 37).attr('x2', cx + 80).attr('y2', cy + 80)
                .attr('stroke', woodDark).attr('stroke-width', 10).attr('stroke-linecap', 'round');
            g.append('line').attr('x1', cx + 37).attr('y1', cy + 37).attr('x2', cx + 80).attr('y2', cy + 80)
                .attr('stroke', wood).attr('stroke-width', 6).attr('stroke-linecap', 'round');
            // wood-grain highlight
            g.append('line').attr('x1', cx + 42).attr('y1', cy + 40).attr('x2', cx + 75).attr('y2', cy + 73)
                .attr('stroke', '#c48a52').attr('stroke-width', 0.9).attr('stroke-opacity', 0.6);

            // Outer iron ring
            g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', lensR + 3)
                .attr('fill', 'none').attr('stroke', '#2b1a08').attr('stroke-width', 3.5);
            // Brass ring
            g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', lensR)
                .attr('fill', bg).attr('stroke', brass).attr('stroke-width', 1.8);
            // Glass sheen (upper-left)
            g.append('ellipse').attr('cx', cx - 18).attr('cy', cy - 18).attr('rx', 17).attr('ry', 9)
                .attr('fill', 'rgba(255,255,255,0.32)').attr('stroke', 'none')
                .attr('transform', 'rotate(-30 ' + (cx - 18) + ' ' + (cy - 18) + ')');

            // Symbol inside lens
            drawLensSymbol(g, cx, cy, s.sym, s.color);

            // Verb below lens
            g.append('text').attr('x', cx).attr('y', cy + lensR + 32)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px').attr('font-weight', '700').attr('letter-spacing', '2px')
                .attr('fill', s.color)
                .text(s.verb);

            // Phrase below verb
            g.append('text').attr('x', cx).attr('y', cy + lensR + 52)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11.5px').attr('fill', ink).attr('fill-opacity', 0.8)
                .text(s.phrase);
        });

        // ── Progression strip: from existing evidence to reproducible pattern ──
        var pY = 400;
        svg.append('line').attr('x1', 80).attr('x2', W - 80)
            .attr('y1', pY).attr('y2', pY)
            .attr('stroke', muted).attr('stroke-width', 0.5).attr('stroke-opacity', 0.5);
        // Left anchor
        svg.append('text').attr('x', 90).attr('y', pY - 14)
            .attr('font-size', '11px').attr('font-weight', '700').attr('letter-spacing', '2px').attr('fill', green)
            .text('\u25C6  ALREADY SANCTIONED');
        svg.append('text').attr('x', 90).attr('y', pY + 20)
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('three months of delivery \u00B7 existing controls \u00B7 evolving QMS');
        // Right anchor
        svg.append('text').attr('x', W - 90).attr('y', pY - 14)
            .attr('text-anchor', 'end')
            .attr('font-size', '11px').attr('font-weight', '700').attr('letter-spacing', '2px').attr('fill', crimson)
            .text('REPRODUCIBLE PATTERN  \u25C6');
        svg.append('text').attr('x', W - 90).attr('y', pY + 20)
            .attr('text-anchor', 'end')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('policy \u00B7 practice \u00B7 methods paper');
        // Center arrow across the strip
        svg.append('path')
            .attr('d', 'M ' + 360 + ' ' + pY + ' L ' + (W - 360) + ' ' + pY)
            .attr('stroke', amber).attr('stroke-width', 1).attr('stroke-opacity', 0.6);
        svg.append('path')
            .attr('d', 'M ' + (W - 360) + ' ' + pY + ' l -9 -5 l 0 10 z')
            .attr('fill', amber).attr('fill-opacity', 0.7);

        // ── Bottom takeaway ──
        svg.append('line').attr('x1', 60).attr('x2', W - 60)
            .attr('y1', H - 96).attr('y2', H - 96)
            .attr('stroke', amber).attr('stroke-width', 0.6).attr('stroke-opacity', 0.4);
        svg.append('text').attr('x', W / 2).attr('y', H - 68)
            .attr('text-anchor', 'middle')
            .attr('font-size', '22px').attr('font-weight', '700').attr('fill', ink)
            .attr('letter-spacing', '1px')
            .text('Not permission.   Recognition.');
        svg.append('text').attr('x', W / 2).attr('y', H - 38)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px').attr('font-style', 'italic').attr('fill', amber)
            .text('Not a side project.   A reproducible institutional pattern.');
        svg.append('text').attr('x', W / 2).attr('y', H - 12)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('fill', muted)
            .text('Yale should be able to recognize, evaluate, harden, and disseminate innovation built inside its own walls \u2014 not only buy it.');
    }

    // ─── SHEFFIELD PARALLEL — two timelines, one pattern (simplified) ───
    function sheffieldParallel(container, config) {
        var W = 1280, H = 640;
        var bg = '#faf7f1';
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var then = '#8b5a2b';
        var now = '#2e6da4';
        var amber = '#b45309';
        var crimson = '#a03a2e';
        // Blend-pill colors
        var pLogic = '#7a4a8f';
        var pMed   = '#a03a2e';
        var pHum   = '#b45309';
        var pCS    = '#2e6da4';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '90vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // ── Title (reframed: pattern, not fight) ──
        svg.append('text').attr('x', W / 2).attr('y', 28)
            .attr('text-anchor', 'middle')
            .attr('font-size', '24px').attr('font-weight', '700').attr('fill', ink)
            .text('Yale Has Walked This Path Before');
        svg.append('text').attr('x', W / 2).attr('y', 50)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', muted)
            .text('Applied sciences were once dismissed as mere technique. The pattern repeats. Institutions that adapt, lead.');

        var margin = 90;
        var tx0 = margin, tx1 = W - margin;

        // ── THEN timeline (3 milestones) ──
        var thenY = 130;
        svg.append('text').attr('x', tx0).attr('y', thenY - 36)
            .attr('font-size', '11.5px').attr('font-weight', '700')
            .attr('letter-spacing', '2.5px').attr('fill', then)
            .text('THEN \u2014 APPLIED SCIENCES AT YALE');
        svg.append('line').attr('x1', tx0).attr('x2', tx1)
            .attr('y1', thenY).attr('y2', thenY)
            .attr('stroke', then).attr('stroke-width', 1);

        var thenScale = d3.scaleLinear().domain([1795, 1880]).range([tx0, tx1]);
        var thenMs = [
            { year: 1804, label: 'Silliman\u2019s first lectures on chemistry', depth: 1 },
            { year: 1847, label: 'Sheffield Scientific School founded', emphasize: true, depth: 1 },
            { year: 1861, label: 'named; applied sciences gain footing', depth: 2 }
        ];
        thenMs.forEach(function(m) {
            var mx = thenScale(m.year);
            var color = m.emphasize ? crimson : then;
            var labelY = thenY + (m.depth === 2 ? 66 : 44);
            svg.append('line').attr('x1', mx).attr('x2', mx)
                .attr('y1', thenY - 5).attr('y2', thenY + 5)
                .attr('stroke', color).attr('stroke-width', m.emphasize ? 1.8 : 1.2);
            svg.append('text').attr('x', mx).attr('y', thenY - 14)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12.5px').attr('font-weight', '700').attr('fill', color)
                .text(m.year);
            // Always draw a thin connector from tick to label so the relationship is unambiguous
            svg.append('line').attr('x1', mx).attr('x2', mx)
                .attr('y1', thenY + 6).attr('y2', labelY - 13)
                .attr('stroke', color).attr('stroke-width', 0.6).attr('stroke-opacity', 0.55);
            svg.append('text').attr('x', mx).attr('y', labelY).attr('class', 'tl-label')
                .attr('text-anchor', 'middle')
                .attr('font-size', '12.5px').attr('font-weight', '600').attr('fill', ink)
                .text(m.label);
        });

        // ── Soft pattern-repeats connector ──
        var cY = 210;
        svg.append('text').attr('x', W / 2).attr('y', cY)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('font-weight', '700')
            .attr('letter-spacing', '2.5px').attr('fill', amber)
            .text('THE PATTERN REPEATS');
        // subtle connector arcs — left arc floats above the text, right arc drops below
        svg.append('path')
            .attr('d', 'M ' + (W / 2 - 150) + ' ' + (cY - 8) +
                      ' Q ' + (W / 2 - 85) + ' ' + (cY - 28) + ' ' +
                             (W / 2 - 20) + ' ' + (cY - 14))
            .attr('fill', 'none').attr('stroke', amber).attr('stroke-width', 0.8).attr('stroke-opacity', 0.6);
        svg.append('path')
            .attr('d', 'M ' + (W / 2 + 20) + ' ' + (cY + 4) +
                      ' Q ' + (W / 2 + 85) + ' ' + (cY + 22) + ' ' +
                             (W / 2 + 150) + ' ' + (cY + 8))
            .attr('fill', 'none').attr('stroke', amber).attr('stroke-width', 0.8).attr('stroke-opacity', 0.6);

        // ── NOW timeline (4 milestones) ──
        var nowY = 285;
        svg.append('text').attr('x', tx0).attr('y', nowY - 36)
            .attr('font-size', '11.5px').attr('font-weight', '700')
            .attr('letter-spacing', '2.5px').attr('fill', now)
            .text('NOW \u2014 CLINICAL AND APPLIED INFORMATICS');
        svg.append('line').attr('x1', tx0).attr('x2', tx1)
            .attr('y1', nowY).attr('y2', nowY)
            .attr('stroke', now).attr('stroke-width', 1);

        var nowScale = d3.scaleLinear().domain([1975, 2030]).range([tx0, tx1]);
        var nowMs = [
            { year: 1980, label: 'Lincoln & Korpman', depth: 1 },
            { year: 1984, label: 'Lindberg \u2192 NLM (IAIMS)', depth: 2 },
            { year: 1989, label: 'AMIA founded', depth: 1 },
            { year: 2026, label: 'applied informatics', subLabel: 'the institutional answer', emphasize: true, depth: 1 }
        ];
        nowMs.forEach(function(m) {
            var mx = nowScale(m.year);
            var color = m.emphasize ? crimson : now;
            var labelY = nowY + (m.depth === 2 ? 66 : 44);
            svg.append('line').attr('x1', mx).attr('x2', mx)
                .attr('y1', nowY - 5).attr('y2', nowY + 5)
                .attr('stroke', color).attr('stroke-width', m.emphasize ? 1.8 : 1.2);
            svg.append('text').attr('x', mx).attr('y', nowY - 14)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12.5px').attr('font-weight', '700').attr('fill', color)
                .text(m.year);
            // Always draw a thin connector from tick to label so the relationship is unambiguous
            svg.append('line').attr('x1', mx).attr('x2', mx)
                .attr('y1', nowY + 6).attr('y2', labelY - 13)
                .attr('stroke', color).attr('stroke-width', 0.6).attr('stroke-opacity', 0.55);
            svg.append('text').attr('x', mx).attr('y', labelY).attr('class', 'tl-label')
                .attr('text-anchor', 'middle')
                .attr('font-size', '12.5px').attr('font-weight', '600').attr('fill', ink)
                .text(m.label);
            if (m.subLabel) {
                svg.append('text').attr('x', mx).attr('y', labelY + 15)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', muted)
                    .text(m.subLabel);
            }
        });

        // ── INFORMATICS IS A BLEND strip ──
        var blendY = 390;
        svg.append('line').attr('x1', 60).attr('x2', W - 60)
            .attr('y1', blendY - 16).attr('y2', blendY - 16)
            .attr('stroke', muted).attr('stroke-width', 0.5).attr('stroke-opacity', 0.5);
        svg.append('text').attr('x', W / 2).attr('y', blendY)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-weight', '700').attr('letter-spacing', '2px').attr('fill', ink)
            .text('INFORMATICS IS A BLEND');
        svg.append('text').attr('x', W / 2).attr('y', blendY + 18)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('not IT \u00B7 not pure computer science \u00B7 not \u201Cjust engineering\u201D');

        // Four pills
        var pills = [
            { label: 'logical sciences',  color: pLogic },
            { label: 'medicine',          color: pMed },
            { label: 'humanities',          color: pHum },
            { label: 'computer science',  color: pCS }
        ];
        var pillY = blendY + 40;
        var pillH = 40;
        var pillGap = 18;
        var pillW = (W - 2 * 180 - 3 * pillGap) / 4;
        pills.forEach(function(p, i) {
            var px = 180 + i * (pillW + pillGap);
            svg.append('rect').attr('x', px).attr('y', pillY)
                .attr('width', pillW).attr('height', pillH)
                .attr('rx', pillH / 2)
                .attr('fill', p.color).attr('fill-opacity', 0.12)
                .attr('stroke', p.color).attr('stroke-width', 1.2);
            svg.append('text').attr('x', px + pillW / 2).attr('y', pillY + pillH / 2 + 5)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12.5px').attr('font-weight', '700').attr('fill', p.color)
                .text(p.label);
            // + between pills
            if (i < pills.length - 1) {
                svg.append('text').attr('x', px + pillW + pillGap / 2).attr('y', pillY + pillH / 2 + 5)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '15px').attr('font-weight', '700').attr('fill', muted)
                    .text('+');
            }
        });

        svg.append('text').attr('x', W / 2).attr('y', pillY + pillH + 28)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('fill', ink)
            .text('Applied informatics = the conscious, careful application of all of the above.');
        svg.append('text').attr('x', W / 2).attr('y', pillY + pillH + 46)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text('Xenonym is the live example: it takes an informatician to articulate why \u201Cpick a name, any name\u201D is wrong in a clinical system.');

        // ── Bottom takeaway (reframed) ──
        svg.append('line').attr('x1', 60).attr('x2', W - 60)
            .attr('y1', H - 64).attr('y2', H - 64)
            .attr('stroke', amber).attr('stroke-width', 0.6).attr('stroke-opacity', 0.45);
        svg.append('text').attr('x', W / 2).attr('y', H - 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14.5px').attr('font-weight', '700').attr('fill', ink)
            .text('Reluctance to adapt is a recurring cost. Institutions that recognize the moment, lead.');
        svg.append('text').attr('x', W / 2).attr('y', H - 18)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', amber)
            .text('Sheffield was the institutional answer in 1847. Applied informatics is the institutional answer now \u2014 wherever it is recognized.');
    }

    // ─── IDEAS, NOT ZOMBIES — decomposition of the graveyard ───
    function ideasNotZombies(container, config) {
        var W = 1280, H = 680;
        var bg = '#faf7f1';
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var faded = '#aa9e87';
        var amber = '#b45309';
        var crimson = '#a03a2e';
        var green = '#4a7d3a';
        var ideasColor = '#8b4a9a';
        var algoColor = '#2e6da4';
        var optColor = '#b45309';
        var fragColor = '#4a7d3a';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '88vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // Title & subtitle
        svg.append('text').attr('x', W / 2).attr('y', 40)
            .attr('text-anchor', 'middle')
            .attr('font-size', '24px').attr('font-weight', '700').attr('fill', ink)
            .text('Ideas, Not Zombies \u2014 Decomposing the Graveyard');
        svg.append('text').attr('x', W / 2).attr('y', 64)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('Abandoned code is a source. AI is archaeologist AND recycler. Discipline is the difference between a latent asset and environmental noise.');

        // Main content block
        var topY = 102;
        var botY = 380;

        // ── LEFT PANEL: the Graveyard ──
        var gx0 = 55, gx1 = 400;
        svg.append('rect').attr('x', gx0).attr('y', topY)
            .attr('width', gx1 - gx0).attr('height', botY - topY)
            .attr('fill', faded).attr('fill-opacity', 0.10)
            .attr('stroke', faded).attr('stroke-width', 1.2)
            .attr('stroke-dasharray', '6,4')
            .attr('rx', 4);
        svg.append('text').attr('x', (gx0 + gx1) / 2).attr('y', topY - 8)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('font-weight', '700')
            .attr('letter-spacing', '1.5px').attr('fill', muted)
            .text('THE GRAVEYARD');

        var files = [
            { name: '.py',    year: '2019', rot: -2.2 },
            { name: '.R',     year: '2020', rot: 1.6 },
            { name: '.ipynb', year: '2021', rot: -1.1 },
            { name: '.sh',    year: '2022', rot: 0.9 }
        ];
        files.forEach(function(f, i) {
            var fx = gx0 + 44 + i * 76;
            var fy = topY + 46;
            var g = svg.append('g')
                .attr('transform', 'translate(' + fx + ',' + fy + ') rotate(' + f.rot + ')');
            g.append('rect').attr('x', 0).attr('y', 0).attr('width', 54).attr('height', 66)
                .attr('fill', bg).attr('stroke', faded).attr('stroke-width', 1.2)
                .attr('rx', 2);
            g.append('path').attr('d', 'M 42 0 L 54 12 L 42 12 Z')
                .attr('fill', faded).attr('fill-opacity', 0.35);
            g.append('line').attr('x1', 42).attr('y1', 0).attr('x2', 42).attr('y2', 12)
                .attr('stroke', faded).attr('stroke-width', 0.9);
            g.append('line').attr('x1', 42).attr('y1', 12).attr('x2', 54).attr('y2', 12)
                .attr('stroke', faded).attr('stroke-width', 0.9);
            g.append('text').attr('x', 27).attr('y', 36)
                .attr('text-anchor', 'middle').attr('font-size', '11px').attr('fill', faded)
                .text(f.name);
            g.append('text').attr('x', 27).attr('y', 52)
                .attr('text-anchor', 'middle').attr('font-size', '9.5px').attr('fill', faded)
                .text(f.year);
        });

        svg.append('text').attr('x', (gx0 + gx1) / 2).attr('y', topY + 170)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('font-style', 'italic').attr('fill', faded)
            .text('author: \u2205');
        svg.append('text').attr('x', (gx0 + gx1) / 2).attr('y', topY + 192)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', faded)
            .text('README.md: empty');
        svg.append('text').attr('x', (gx0 + gx1) / 2).attr('y', topY + 212)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', faded)
            .text('last commit: three years ago');
        svg.append('text').attr('x', (gx0 + gx1) / 2).attr('y', topY + 240)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text('\u201Cit worked on their laptop. once.\u201D');

        svg.append('text').attr('x', (gx0 + gx1) / 2).attr('y', botY + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('fill', muted)
            .text('the submerged mass');

        // ── MIDDLE: AI AS ARCHAEOLOGIST / RECYCLER ──
        var mx0 = 425, mx1 = 720;
        var mxMid = (mx0 + mx1) / 2;
        svg.append('text').attr('x', mxMid).attr('y', topY - 8)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('font-weight', '700')
            .attr('letter-spacing', '1.5px').attr('fill', amber)
            .text('AI AS ARCHAEOLOGIST  \u00B7  AS RECYCLER');

        // Horizontal flow arrow, left to right
        var midArrowY = topY + 40;
        svg.append('line').attr('x1', mx0 - 10).attr('x2', mx1 + 10)
            .attr('y1', midArrowY).attr('y2', midArrowY)
            .attr('stroke', amber).attr('stroke-width', 1.4);
        svg.append('path')
            .attr('d', 'M ' + (mx1 + 10) + ' ' + midArrowY + ' l -10 -5 l 0 10 z')
            .attr('fill', amber);

        // Four stacked operation labels
        var fSteps = [
            { step: 'READ',        detail: 'the source files, dependencies, comments' },
            { step: 'RECONSTRUCT', detail: 'intent \u2014 what was the author trying to ask?' },
            { step: 'REGENERATE',  detail: 'missing docs, tests, runnable environment' },
            { step: 'RESTORE',     detail: 'a working pipeline \u2014 in hours, not months' }
        ];
        fSteps.forEach(function(s, i) {
            var sy = midArrowY + 40 + i * 60;
            svg.append('text').attr('x', mxMid).attr('y', sy)
                .attr('text-anchor', 'middle')
                .attr('font-size', '14px').attr('font-weight', '700')
                .attr('letter-spacing', '2px').attr('fill', ink)
                .text(s.step);
            svg.append('text').attr('x', mxMid).attr('y', sy + 17)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10.5px').attr('font-style', 'italic')
                .attr('fill', muted)
                .text(s.detail);
        });

        // Small recycle glyph under the middle
        var recycX = mxMid, recycY = botY + 22;
        svg.append('path')
            .attr('d', 'M ' + (recycX - 10) + ' ' + (recycY - 4) +
                       ' a 10 10 0 1 1 14 -6')
            .attr('fill', 'none').attr('stroke', green).attr('stroke-width', 1.2);
        svg.append('path')
            .attr('d', 'M ' + (recycX + 4) + ' ' + (recycY - 12) +
                       ' l -4 -2 l 4 -2 l 0 4 z')
            .attr('fill', green);
        svg.append('text').attr('x', recycX + 16).attr('y', recycY)
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', green)
            .text('recycled, not resurrected');

        // ── RIGHT PANEL: WHAT COMES OUT ──
        var rx0 = 760, rx1 = 1225;
        svg.append('text').attr('x', (rx0 + rx1) / 2).attr('y', topY - 8)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('font-weight', '700')
            .attr('letter-spacing', '1.5px').attr('fill', ink)
            .text('WHAT THE DOMAIN EXPERT RECOVERS');

        var outputs = [
            { label: 'IDEAS',         glyph: '\u2734',  caption: 'the research question the author was trying to ask', color: ideasColor },
            { label: 'ALGORITHMS',    glyph: '\u25C8',  caption: 'the solvers, classifiers, joins that worked',        color: algoColor },
            { label: 'OPTIMIZATIONS', glyph: '\u2726',  caption: 'the tricks that made it run on that hardware',       color: optColor },
            { label: 'FRAGMENTS',     glyph: '\u25FC',  caption: 'clever pieces worth keeping, even if the whole isn\u2019t', color: fragColor }
        ];
        outputs.forEach(function(o, i) {
            var oy = topY + 10 + i * 63;
            svg.append('rect').attr('x', rx0).attr('y', oy)
                .attr('width', rx1 - rx0).attr('height', 52)
                .attr('fill', o.color).attr('fill-opacity', 0.08)
                .attr('stroke', o.color).attr('stroke-width', 1)
                .attr('rx', 4);
            svg.append('text').attr('x', rx0 + 20).attr('y', oy + 33)
                .attr('font-size', '20px').attr('fill', o.color)
                .text(o.glyph);
            svg.append('text').attr('x', rx0 + 56).attr('y', oy + 22)
                .attr('font-size', '13px').attr('font-weight', '700').attr('letter-spacing', '1.5px')
                .attr('fill', o.color).text(o.label);
            svg.append('text').attr('x', rx0 + 56).attr('y', oy + 41)
                .attr('font-size', '11.5px').attr('fill', ink).attr('fill-opacity', 0.78)
                .text(o.caption);
        });
        svg.append('text').attr('x', (rx0 + rx1) / 2).attr('y', botY + 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('fill', muted)
            .text('not zombies \u2014 the latent intellectual asset');

        // ── BOTTOM STRIP: SUSTAINABILITY TENSION ──
        var bsY = 460;
        svg.append('line').attr('x1', 60).attr('x2', W - 60)
            .attr('y1', bsY - 14).attr('y2', bsY - 14)
            .attr('stroke', muted).attr('stroke-width', 0.5).attr('stroke-opacity', 0.6);
        // (eyebrow "THE METHOD TO THE MADNESS" removed at user request)

        // Left side — cheap for humans
        svg.append('text').attr('x', 220).attr('y', bsY + 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px').attr('font-weight', '700').attr('fill', green)
            .text('cheap for humans');
        svg.append('text').attr('x', 220).attr('y', bsY + 62)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('fill', ink).attr('fill-opacity', 0.8)
            .text('hours, not months \u00B7 one domain expert + AI');
        svg.append('text').attr('x', 220).attr('y', bsY + 80)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('fill', ink).attr('fill-opacity', 0.8)
            .text('ephemeral systems at near-zero friction');

        // Right side — expensive electronically
        svg.append('text').attr('x', W - 220).attr('y', bsY + 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px').attr('font-weight', '700').attr('fill', crimson)
            .text('expensive electronically');
        svg.append('text').attr('x', W - 220).attr('y', bsY + 62)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('fill', ink).attr('fill-opacity', 0.8)
            .text('compute \u00B7 heat \u00B7 electricity \u00B7 grid load');
        svg.append('text').attr('x', W - 220).attr('y', bsY + 80)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('fill', ink).attr('fill-opacity', 0.8)
            .text('undisciplined, it becomes pollution and noise');

        // Middle hinge — DISCIPLINE
        svg.append('circle').attr('cx', W / 2).attr('cy', bsY + 58).attr('r', 53)
            .attr('fill', amber).attr('fill-opacity', 0.10)
            .attr('stroke', amber).attr('stroke-width', 1.4);  // r bumped 48 → 53 (+10px diameter)
        svg.append('text').attr('x', W / 2).attr('y', bsY + 54)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700').attr('letter-spacing', '2px').attr('fill', amber)
            .text('DISCIPLINE');
        svg.append('text').attr('x', W / 2).attr('y', bsY + 72)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10px').attr('font-style', 'italic').attr('fill', amber)
            .text('recycle, don\u2019t pollute');

        // Connectors from left to middle, middle to right
        svg.append('line').attr('x1', 340).attr('x2', W / 2 - 57)
            .attr('y1', bsY + 58).attr('y2', bsY + 58)
            .attr('stroke', muted).attr('stroke-width', 0.7);
        svg.append('line').attr('x1', W / 2 + 57).attr('x2', W - 340)
            .attr('y1', bsY + 58).attr('y2', bsY + 58)
            .attr('stroke', muted).attr('stroke-width', 0.7);

        // ── Bottom takeaway line ──
        svg.append('line').attr('x1', 60).attr('x2', W - 60)
            .attr('y1', H - 68).attr('y2', H - 68)
            .attr('stroke', amber).attr('stroke-width', 0.6).attr('stroke-opacity', 0.45);
        svg.append('text').attr('x', W / 2).attr('y', H - 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14.5px').attr('font-weight', '700').attr('fill', ink)
            .text('The same abandoned corpus is a liability if ignored \u2014 a latent asset if disciplined.');
        svg.append('text').attr('x', W / 2).attr('y', H - 18)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px').attr('font-style', 'italic').attr('fill', amber)
            .text('Sustainability in scientific compute is not about producing less code. It is about recycling the intelligence already in it.');
    }

    // ─── RESEARCH-SOFTWARE GRAVEYARD (the iceberg) ───
    function researchIceberg(container, config) {
        var W = 1200, H = 640;
        var bg = '#faf7f1';
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var waterColor = '#4b7088';
        var iceAbove = '#eef3f7';
        var iceAboveStroke = '#8ba0b3';
        var iceBelow = '#7a94a8';
        var iceBelowStroke = '#48627a';
        var amber = '#b45309';
        var crimson = '#a03a2e';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '88vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // Title & subtitle
        svg.append('text').attr('x', W / 2).attr('y', 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '23px').attr('font-weight', '700').attr('fill', ink)
            .text('The Research-Software Graveyard');
        svg.append('text').attr('x', W / 2).attr('y', 66)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', muted)
            .text('What you can find on GitHub is the tip. Most of what was built is already gone.');

        // Layout
        var waterY = 252;                 // waterline
        var bottomY = H - 90;             // reserved for caption

        // Water body (subtle tint)
        svg.append('rect').attr('x', 0).attr('y', waterY)
            .attr('width', W).attr('height', bottomY - waterY)
            .attr('fill', waterColor).attr('fill-opacity', 0.10);
        // Waterline
        svg.append('line').attr('x1', 0).attr('x2', W)
            .attr('y1', waterY).attr('y2', waterY)
            .attr('stroke', waterColor).attr('stroke-width', 0.8).attr('stroke-opacity', 0.55);

        // Waterline labels
        svg.append('text').attr('x', 30).attr('y', waterY - 6)
            .attr('font-size', '10.5px').attr('letter-spacing', '1.5px')
            .attr('font-weight', '700').attr('fill', muted).text('VISIBLE');
        svg.append('text').attr('x', 30).attr('y', waterY + 16)
            .attr('font-size', '10.5px').attr('letter-spacing', '1.5px')
            .attr('font-weight', '700').attr('fill', waterColor).text('LOST');

        // ── TIP (above water) — small, light ──
        var tipX = W / 2;
        var tipTop = 120;
        var tipHalfBase = 60;
        svg.append('path')
            .attr('d', 'M ' + tipX + ' ' + tipTop +
                      ' L ' + (tipX - tipHalfBase) + ' ' + waterY +
                      ' L ' + (tipX + tipHalfBase) + ' ' + waterY + ' Z')
            .attr('fill', iceAbove)
            .attr('stroke', iceAboveStroke).attr('stroke-width', 1);

        // Tip labels (maintained, published, runnable, cited)
        var tipLabels = [ 'cited', 'runnable', 'published', 'maintained'  ];
        tipLabels.forEach(function(t, i) {
            svg.append('text').attr('x', tipX).attr('y', 170 + i * 17)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11.5px').attr('fill', ink)
                .text(t);
        });

        // Tip annotation (curl to the right)
        svg.append('text').attr('x', tipX + 130).attr('y', 128)
            .attr('font-size', '12px').attr('font-style', 'italic').attr('fill', muted)
            .text('the tip \u2014 curated, cited, found');
        svg.append('path')
            .attr('d', 'M ' + (tipX + 70) + ' 150 Q ' + (tipX + 105) + ' 135 ' + (tipX + 128) + ' 125')
            .attr('fill', 'none').attr('stroke', muted).attr('stroke-width', 0.6);

        // ── SUBMERGED (below water) — irregular, large ──
        var sTop = waterY;
        var sPath = 'M ' + (tipX - tipHalfBase) + ' ' + sTop +
                    ' L ' + (tipX - 195) + ' ' + (sTop + 50) +
                    ' L ' + (tipX - 265) + ' ' + (sTop + 130) +
                    ' L ' + (tipX - 290) + ' ' + (sTop + 210) +
                    ' L ' + (tipX - 215) + ' ' + (bottomY - 20) +
                    ' L ' + (tipX + 60) + ' ' + bottomY +
                    ' L ' + (tipX + 230) + ' ' + (bottomY - 40) +
                    ' L ' + (tipX + 285) + ' ' + (sTop + 180) +
                    ' L ' + (tipX + 245) + ' ' + (sTop + 90) +
                    ' L ' + (tipX + 120) + ' ' + (sTop + 35) +
                    ' L ' + (tipX + tipHalfBase) + ' ' + sTop + ' Z';
        svg.append('path').attr('d', sPath)
            .attr('fill', iceBelow).attr('fill-opacity', 0.55)
            .attr('stroke', iceBelowStroke).attr('stroke-width', 1);

        // Graveyard labels (scattered inside the submerged mass)
        var grave = [
            { x: tipX - 185, y: sTop + 85,  text: "postdoc\u2019s laptop, 2019" },
            { x: tipX - 55,  y: sTop + 105, text: "abandoned after grad school" },
            { x: tipX + 120, y: sTop + 85,  text: "link rot" },
            { x: tipX - 215, y: sTop + 165, text: "unfinished" },
            { x: tipX + 70,  y: sTop + 175, text: "funding expired" },
            { x: tipX - 70,  y: sTop + 220, text: "not reproducible" },
            { x: tipX + 190, y: sTop + 150, text: "README left blank" },
            { x: tipX - 140, y: sTop + 280, text: "only ran on that one server" },
            { x: tipX + 60,  y: sTop + 250, text: "author unreachable" },
            { x: tipX + 180, y: sTop + 240, text: "dependency broken" },
            { x: tipX - 30,  y: sTop + 320, text: "forgotten" }
        ];
        grave.forEach(function(g) {
            svg.append('text').attr('x', g.x).attr('y', g.y)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11px').attr('font-style', 'italic')
                .attr('fill', ink).attr('fill-opacity', 0.72)
                .text(g.text);
        });

        // Submerged annotation — left edge, outside the iceberg
        svg.append('text').attr('x', 40).attr('y', sTop + 170)
            .attr('font-size', '12.5px').attr('font-weight', '700').attr('fill', waterColor)
            .text('The graveyard.');
        svg.append('text').attr('x', 40).attr('y', sTop + 192)
            .attr('font-size', '11.5px').attr('fill', muted)
            .text('Postdocs write it.');
        svg.append('text').attr('x', 40).attr('y', sTop + 208)
            .attr('font-size', '11.5px').attr('fill', muted)
            .text('Postdocs leave.');
        svg.append('text').attr('x', 40).attr('y', sTop + 230)
            .attr('font-size', '11.5px').attr('fill', muted)
            .text('Nobody else knows');
        svg.append('text').attr('x', 40).attr('y', sTop + 246)
            .attr('font-size', '11.5px').attr('fill', muted)
            .text('how it worked.');
        svg.append('text').attr('x', 40).attr('y', sTop + 272)
            .attr('font-size', '11.5px').attr('font-style', 'italic').attr('fill', crimson)
            .text('Rebuilding used to');
        svg.append('text').attr('x', 40).attr('y', sTop + 288)
            .attr('font-size', '11.5px').attr('font-style', 'italic').attr('fill', crimson)
            .text('cost a month.');

        // ── Bottom rhetorical flip ──
        svg.append('line')
            .attr('x1', 60).attr('x2', W - 60)
            .attr('y1', H - 64).attr('y2', H - 64)
            .attr('stroke', amber).attr('stroke-width', 0.6).attr('stroke-opacity', 0.45);
        svg.append('text').attr('x', W / 2).attr('y', H - 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14.5px').attr('font-weight', '700').attr('fill', ink)
            .text('What changes when rebuilding costs hours, not months?');
        svg.append('text').attr('x', W / 2).attr('y', H - 18)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', amber)
            .text('The domain expert can own the whole loop \u2014 not just the first version, but every restoration after.');

        // ── LOUPE — magnifying glass for the graveyard labels ──
        var defs = svg.append('defs');
        var clipId = 'iceberg-loupe-clip-' + Math.random().toString(36).slice(2, 8);
        var lclip = defs.append('clipPath').attr('id', clipId).attr('clipPathUnits', 'userSpaceOnUse');
        var lclipCircle = lclip.append('circle').attr('r', 74).attr('cx', -1000).attr('cy', -1000);

        var loupeScale = 2.0;

        // Magnified-content layer (clipped). Includes a cream tint disc + redrawn labels + redrawn iceberg outlines for context.
        var loupeContent = svg.append('g')
            .attr('class', 'iceberg-loupe-content')
            .attr('clip-path', 'url(#' + clipId + ')')
            .style('display', 'none')
            .style('pointer-events', 'none');

        // Tint disc — makes magnified text pop cleanly against the original small labels underneath
        loupeContent.append('rect')
            .attr('x', 0).attr('y', 0).attr('width', W).attr('height', H)
            .attr('fill', '#faf7f1').attr('fill-opacity', 0.55);

        // Redraw submerged iceberg silhouette inside the loupe (so edges read correctly at zoom)
        loupeContent.append('path').attr('d', sPath)
            .attr('fill', iceBelow).attr('fill-opacity', 0.42)
            .attr('stroke', iceBelowStroke).attr('stroke-width', 0.8);

        // Magnified grave labels — clearer, bolder, fully visible
        grave.forEach(function(g) {
            loupeContent.append('text').attr('x', g.x).attr('y', g.y)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11px')
                .attr('font-style', 'italic')
                .attr('font-weight', '600')
                .attr('fill', ink).attr('fill-opacity', 0.96)
                .text(g.text);
        });

        // ── Loupe frame (wood handle + brass-and-iron ring) ──
        var loupeFrame = svg.append('g')
            .attr('class', 'iceberg-loupe-frame')
            .style('display', 'none')
            .style('pointer-events', 'none');

        // Handle (wood) — drawn first so the ring overlaps its base
        loupeFrame.append('line').attr('x1', 52).attr('y1', 52).attr('x2', 108).attr('y2', 108)
            .attr('stroke', '#3e2a11').attr('stroke-width', 12).attr('stroke-linecap', 'round');
        loupeFrame.append('line').attr('x1', 52).attr('y1', 52).attr('x2', 108).attr('y2', 108)
            .attr('stroke', '#8b5a2b').attr('stroke-width', 7).attr('stroke-linecap', 'round');
        // tiny wood-grain highlight on handle
        loupeFrame.append('line').attr('x1', 58).attr('y1', 56).attr('x2', 102).attr('y2', 100)
            .attr('stroke', '#c48a52').attr('stroke-width', 1).attr('stroke-linecap', 'round').attr('opacity', 0.7);

        // Outer iron ring
        loupeFrame.append('circle').attr('r', 75).attr('cx', 0).attr('cy', 0)
            .attr('fill', 'none').attr('stroke', '#2b1a08').attr('stroke-width', 5);
        // Inner brass ring
        loupeFrame.append('circle').attr('r', 71).attr('cx', 0).attr('cy', 0)
            .attr('fill', 'none').attr('stroke', '#b8865b').attr('stroke-width', 2.5);
        // very subtle glass sheen
        loupeFrame.append('circle').attr('r', 67).attr('cx', 0).attr('cy', 0)
            .attr('fill', 'rgba(255,253,247,0.05)').attr('stroke', 'none');
        // small crescent highlight (upper-left)
        loupeFrame.append('ellipse').attr('cx', -28).attr('cy', -28).attr('rx', 22).attr('ry', 12)
            .attr('fill', 'rgba(255,255,255,0.35)').attr('stroke', 'none').attr('transform', 'rotate(-30 -28 -28)');

        // ── Hit region — catches mouse events over the submerged area ──
        var hitRect = svg.append('rect')
            .attr('x', 0).attr('y', waterY)
            .attr('width', W).attr('height', bottomY - waterY)
            .attr('fill', 'transparent')
            .style('cursor', 'none');

        hitRect.on('mouseenter', function() {
            loupeFrame.style('display', null);
            loupeContent.style('display', null);
        });
        hitRect.on('mouseleave', function() {
            loupeFrame.style('display', 'none');
            loupeContent.style('display', 'none');
        });
        hitRect.on('mousemove', function(event) {
            var p = d3.pointer(event, svg.node());
            var cx = p[0], cy = p[1];
            // Position loupe frame
            loupeFrame.attr('transform', 'translate(' + cx + ',' + cy + ')');
            // Move clip circle to cursor
            lclipCircle.attr('cx', cx).attr('cy', cy);
            // Magnify content centered on cursor:
            //   translate(cx*(1-s), cy*(1-s)) scale(s)  => point (cx, cy) maps to itself
            var tx = cx * (1 - loupeScale);
            var ty = cy * (1 - loupeScale);
            loupeContent.attr('transform', 'translate(' + tx + ',' + ty + ') scale(' + loupeScale + ')');
        });
    }

    // ─── METAPHOR TO MECHANISM (closing visual — Tufte, Visual Explanations) ───
    function metaphorToMechanism(container, config) {
        var W = 1280, H = 620;
        var bg = '#faf7f1';
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var cloudFill = '#a8b4c4';
        var cloudStroke = '#6b7c8f';
        var cityFill = '#2d3d52';
        var cityStroke = '#1a2738';
        var windowFill = '#e8d4a0';
        var crimson = '#a03a2e';
        var cardBg = '#fffdf7';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '88vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");

        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // ── Title / subtitle ──
        svg.append('text').attr('x', W / 2).attr('y', 42)
            .attr('text-anchor', 'middle')
            .attr('font-size', '24px').attr('font-weight', '700').attr('fill', ink)
            .text('The Metaphor Became the Mechanism');
        svg.append('text').attr('x', W / 2).attr('y', 68)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', muted)
            .text("A principle the pioneers of medical informatics embodied in 1980. A mechanism only recently available to the rest of us.");
        svg.append('text').attr('x', W / 2).attr('y', 86)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text("Hover any milestone for context.");

        // ── Layout ──
        var margin = 70;
        var tx0 = margin, tx1 = W - margin;
        var groundY = 430;
        var timeScale = d3.scaleLinear().domain([1978, 2027]).range([tx0, tx1]);

        // ── Earth line ──
        svg.append('line')
            .attr('x1', tx0).attr('x2', tx1)
            .attr('y1', groundY).attr('y2', groundY)
            .attr('stroke', ink).attr('stroke-width', 0.8);

        // ── Cloud (metaphor) — dense left, dissipating right ──
        var cloudParts = [
            { y: 1979, cy: 200, r: 42, op: 0.85 },
            { y: 1981, cy: 170, r: 50, op: 0.90 },
            { y: 1983, cy: 185, r: 40, op: 0.85 },
            { y: 1985, cy: 175, r: 32, op: 0.70 },
            { y: 1987, cy: 195, r: 26, op: 0.58 },
            { y: 1990, cy: 180, r: 24, op: 0.50 },
            { y: 1995, cy: 185, r: 22, op: 0.42 },
            { y: 2001, cy: 180, r: 19, op: 0.34 },
            { y: 2008, cy: 190, r: 16, op: 0.26 },
            { y: 2015, cy: 185, r: 13, op: 0.18 },
            { y: 2020, cy: 193, r: 10, op: 0.12 },
            { y: 2024, cy: 197, r: 7,  op: 0.07 }
        ];
        var cloudLayer = svg.append('g');
        cloudParts.forEach(function(p) {
            cloudLayer.append('circle')
                .attr('cx', timeScale(p.y)).attr('cy', p.cy).attr('r', p.r)
                .attr('fill', cloudFill).attr('fill-opacity', p.op * 0.55)
                .attr('stroke', cloudStroke).attr('stroke-width', 0.7).attr('stroke-opacity', p.op);
        });

        // Inscription — Peter's own line
        var cloudTextX = timeScale(1981);
        svg.append('text').attr('x', cloudTextX).attr('y', 160)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-style', 'italic').attr('fill', ink)
            .text("\u201Csoftware should be");
        svg.append('text').attr('x', cloudTextX).attr('y', 174)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-style', 'italic').attr('fill', ink)
            .text("a reflection of");
        svg.append('text').attr('x', cloudTextX).attr('y', 188)
            .attr('text-anchor', 'middle').attr('font-size', '11px')
            .attr('font-style', 'italic').attr('fill', ink)
            .text("your thought.\u201D");

        // Cloud caption
        svg.append('text').attr('x', timeScale(1981)).attr('y', 116)
            .attr('text-anchor', 'middle').attr('font-size', '10.5px')
            .attr('font-weight', '700').attr('letter-spacing', '1.5px').attr('fill', cloudStroke)
            .text('THE METAPHOR');

        // ── City (mechanism) — nothing left, sprawling right ──
        var buildings = [
            { y: 2002,   w: 14, h: 38,  win: false },
            { y: 2004,   w: 18, h: 54,  win: false },
            { y: 2007,   w: 16, h: 46,  win: false },
            { y: 2009,   w: 22, h: 70,  win: true },
            { y: 2012,   w: 20, h: 56,  win: true },
            { y: 2014,   w: 26, h: 86,  win: true },
            { y: 2016,   w: 22, h: 66,  win: true },
            { y: 2018,   w: 28, h: 98,  win: true },
            { y: 2020,   w: 24, h: 78,  win: true },
            { y: 2022,   w: 30, h: 118, win: true },
            { y: 2023.3, w: 26, h: 94,  win: true },
            { y: 2024,   w: 32, h: 138, win: true },
            { y: 2024.8, w: 24, h: 110, win: true },
            { y: 2025,   w: 34, h: 168, win: true, emphasize: true },
            { y: 2025.6, w: 26, h: 128, win: true },
            { y: 2026,   w: 38, h: 196, win: true, emphasize: true }
        ];
        var cityLayer = svg.append('g');
        buildings.forEach(function(b) {
            var bx = timeScale(b.y);
            var bY = groundY - b.h;
            cityLayer.append('rect')
                .attr('x', bx - b.w / 2).attr('y', bY)
                .attr('width', b.w).attr('height', b.h)
                .attr('fill', b.emphasize ? cityStroke : cityFill)
                .attr('stroke', cityStroke).attr('stroke-width', 0.7);
            if (b.win && b.h > 50) {
                var rows = Math.floor((b.h - 16) / 14);
                for (var ri = 1; ri <= rows; ri++) {
                    var wy = bY + ri * 14 - 2;
                    cityLayer.append('rect')
                        .attr('x', bx - b.w / 2 + 3).attr('y', wy)
                        .attr('width', 3).attr('height', 2)
                        .attr('fill', windowFill).attr('fill-opacity', 0.6);
                    cityLayer.append('rect')
                        .attr('x', bx + b.w / 2 - 6).attr('y', wy)
                        .attr('width', 3).attr('height', 2)
                        .attr('fill', windowFill).attr('fill-opacity', 0.6);
                }
            }
            if (b.emphasize) {
                cityLayer.append('line')
                    .attr('x1', bx).attr('x2', bx)
                    .attr('y1', bY).attr('y2', bY - 10)
                    .attr('stroke', cityStroke).attr('stroke-width', 0.8);
            }
        });

        svg.append('text').attr('x', timeScale(2025)).attr('y', 116)
            .attr('text-anchor', 'middle').attr('font-size', '10.5px')
            .attr('font-weight', '700').attr('letter-spacing', '1.5px').attr('fill', cityStroke)
            .text('THE MECHANISM');

        // ── Milestones — year, short label, and detail (for hover) ──
        // Short labels are kept compact; detail reveals on hover ("magnifying glass").
        var milestones = [
            { year: 1980, short: 'Lincoln & Korpman',
              detail: "Pioneers of medical informatics. Published in Science. Automated their own clinical workflow — software that was a reflection of their thought before there was a name for it.",
              depth: 1 },
            { year: 1986, short: 'Boehm Spiral',
              detail: "Boehm's Spiral Model: risk-driven iteration. The first systematic break from waterfall — software built in loops, not a one-way march.",
              depth: 2 },
            { year: 1991, short: "Martin's RAD",
              detail: "James Martin formalizes Rapid Application Development. Tools like Visual Basic and PowerBuilder let the builder iterate with the user in the room.",
              depth: 1 },
            { year: 2000, short: 'Baldwin-Clark',
              detail: '"Design Rules, Vol. 1: The Power of Modularity." The theoretical foundation of composable systems — pieces that have lives of their own.',
              depth: 2 },
            { year: 2001.3, short: 'Agile Manifesto',
              detail: "Signed at Snowbird, February 2001. Twelve principles placing working software and human collaboration above rigid process. XP, pair programming, retrospectives descend from this moment.",
              depth: 1 },
            { year: 2005, short: 'Ajax · Web 2.0',
              detail: "Jesse James Garrett names Ajax. XMLHttpRequest + JSON + dynamic UIs. The browser becomes a platform for real software — not static pages.",
              depth: 2 },
            { year: 2008, short: 'GitHub · Stack Overflow',
              detail: "Both launch. Distributed version control as a shared public good. Every question a programmer had became one someone else had already answered.",
              depth: 1 },
            { year: 2013, short: 'Docker',
              detail: "Containers. The thing you built on your laptop runs everywhere, identically. Reproducible environments become the default, not the exception.",
              depth: 2 },
            { year: 2022, short: 'ChatGPT · Copilot',
              detail: "LLMs enter the developer's workspace. GitHub Copilot (2021) and ChatGPT (Nov 2022). The first mark is free — the blank page dissolves.",
              depth: 1 },
            { year: 2025, short: 'Claude Code',
              detail: "Agentic coding. The threshold collapses. The metaphor becomes the mechanism — you speak the tool into existence.",
              depth: 2, emphasize: true }
        ];

        // Group container for all milestones so we can lift hovered one on top.
        var msLayer = svg.append('g').attr('class', 'milestones');

        // Build milestone elements
        var groups = milestones.map(function(m, i) {
            var mx = timeScale(m.year);
            var mColor = m.emphasize ? crimson : ink;
            var g = msLayer.append('g').attr('class', 'milestone').attr('data-i', i);

            // Tick
            g.append('line')
                .attr('x1', mx).attr('x2', mx)
                .attr('y1', groundY).attr('y2', groundY + 6)
                .attr('stroke', mColor).attr('stroke-width', m.emphasize ? 1.5 : 1);

            // Year label — always below the tick, above all short labels
            g.append('text').attr('x', mx).attr('y', groundY + 22)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11.5px').attr('font-weight', '700').attr('fill', mColor)
                .text(String(Math.floor(m.year)));

            // Short label — all below the axis, alternating two depths to avoid collisions
            var shortY = groundY + (m.depth === 2 ? 58 : 40);

            // Thin guide-line from below the year down to the deeper row
            if (m.depth === 2) {
                g.append('line').attr('x1', mx).attr('x2', mx)
                    .attr('y1', groundY + 30).attr('y2', shortY - 11)
                    .attr('stroke', mColor).attr('stroke-width', 0.5).attr('stroke-opacity', 0.5);
            }

            var shortLabel = g.append('text').attr('x', mx).attr('y', shortY)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10.5px').attr('fill', ink)
                .text(m.short);

            // Dot at the tick — the hover target
            var dot = g.append('circle')
                .attr('cx', mx).attr('cy', groundY)
                .attr('r', 4)
                .attr('fill', cardBg)
                .attr('stroke', mColor).attr('stroke-width', 1.5)
                .style('cursor', 'pointer');

            return { m: m, mx: mx, g: g, dot: dot, shortLabel: shortLabel };
        });

        // 2025 "threshold collapses" pointer (static — independent of hover)
        var arrowX = timeScale(2025);
        var arrowY0 = groundY - 195;
        var arrowY1 = groundY - 172;
        svg.append('line')
            .attr('x1', arrowX).attr('x2', arrowX)
            .attr('y1', arrowY0).attr('y2', arrowY1)
            .attr('stroke', crimson).attr('stroke-width', 1.5);
        svg.append('path')
            .attr('d', 'M ' + arrowX + ' ' + arrowY1 + ' l -3 -5 l 6 0 z')
            .attr('fill', crimson);
        svg.append('text').attr('x', arrowX).attr('y', arrowY0 - 6)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-weight', '700').attr('fill', crimson)
            .text('the threshold collapses');

        // ── Hover card — one shared card, repositioned per milestone ──
        var cardLayer = svg.append('g').attr('class', 'hover-card')
            .style('opacity', 0).style('pointer-events', 'none');
        var cardW = 280, cardH = 110;
        var cardRect = cardLayer.append('rect')
            .attr('width', cardW).attr('height', cardH).attr('rx', 6)
            .attr('fill', cardBg).attr('stroke', ink).attr('stroke-width', 1)
            .style('filter', 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))');
        var cardTitle = cardLayer.append('text')
            .attr('x', 14).attr('y', 24)
            .attr('font-size', '13px').attr('font-weight', '700').attr('fill', ink);
        var cardBody = cardLayer.append('g').attr('class', 'card-body');
        var cardArrow = cardLayer.append('path')
            .attr('fill', cardBg).attr('stroke', ink).attr('stroke-width', 1);

        function wrapLines(text, maxChars) {
            var words = String(text).split(/\s+/);
            var lines = [], cur = '';
            words.forEach(function(w) {
                if ((cur + ' ' + w).trim().length > maxChars) {
                    if (cur) lines.push(cur.trim());
                    cur = w;
                } else {
                    cur = (cur + ' ' + w).trim();
                }
            });
            if (cur) lines.push(cur);
            return lines;
        }

        function showCard(d) {
            cardTitle.text(Math.floor(d.m.year) + '  \u00B7  ' + d.m.short);
            cardBody.selectAll('*').remove();
            var lines = wrapLines(d.m.detail, 46);
            lines.forEach(function(ln, i) {
                cardBody.append('text')
                    .attr('x', 14).attr('y', 46 + i * 15)
                    .attr('font-size', '11.5px').attr('fill', ink)
                    .text(ln);
            });

            // Position: always above the tick (the label zone is below); clamp within viewBox.
            var cy = groundY - cardH - 18;
            var cx = d.mx - cardW / 2;
            if (cx < 10) cx = 10;
            if (cx + cardW > W - 10) cx = W - cardW - 10;
            cardLayer.attr('transform', 'translate(' + cx + ',' + cy + ')');

            // Arrow pointer from the bottom of the card down toward the tick
            var apX = d.mx - cx;
            cardArrow.attr('d',
                'M ' + (apX - 6) + ' ' + cardH +
                ' L ' + apX + ' ' + (cardH + 10) +
                ' L ' + (apX + 6) + ' ' + cardH + ' Z');

            cardLayer.transition().duration(150).style('opacity', 1);
            d.dot.transition().duration(150).attr('r', 7)
                .attr('fill', d.m.emphasize ? crimson : ink)
                .attr('stroke', cardBg);
            d.shortLabel.transition().duration(150)
                .attr('font-weight', '700')
                .attr('fill', d.m.emphasize ? crimson : ink);
        }

        function hideCard(d) {
            cardLayer.transition().duration(150).style('opacity', 0);
            d.dot.transition().duration(150).attr('r', 4)
                .attr('fill', cardBg)
                .attr('stroke', d.m.emphasize ? crimson : ink);
            d.shortLabel.transition().duration(150)
                .attr('font-weight', null)
                .attr('fill', ink);
        }

        // Wire up hover on each milestone (dot AND larger invisible hit area covering both label rows)
        groups.forEach(function(d) {
            var hit = d.g.append('rect')
                .attr('x', d.mx - 26).attr('y', groundY - 10)
                .attr('width', 52).attr('height', 82)
                .attr('fill', 'transparent')
                .style('cursor', 'pointer');
            hit.on('mouseenter', function() { showCard(d); });
            hit.on('mouseleave', function() { hideCard(d); });
            d.dot.on('mouseenter', function() { showCard(d); });
            d.dot.on('mouseleave', function() { hideCard(d); });
        });

        // ── Bottom closing lines ──
        svg.append('text').attr('x', W / 2).attr('y', H - 50)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px').attr('font-weight', '700').attr('fill', ink)
            .text('For forty-five years, a metaphor. For the last six months, a mechanism.');
        svg.append('text').attr('x', W / 2).attr('y', H - 26)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('You think it. You say it. The tool takes shape around it.');
    }

    var registry = {
        'workflow-pipeline': workflowPipeline,
        'abstraction-layers': abstractionLayers,
        'systems-ecosystem': systemsEcosystem,
        'ai-maturity-ladder': aiMaturityLadder,
        'data-flow': dataFlow,
        'automation-ladder': automationLadder,
        'phase-comparison': phaseComparison,
        'case-timeline': caseTimeline,
        'measurement-intervals': measurementIntervals,
        'animated-pipeline': animatedPipeline,
        'seven-options-ladder': sevenOptionsLadder,
        'cost-comparison': costComparison,
        'tech-stack-pyramid': techStackPyramid,
        'dev-lifecycle-loop': devLifecycleLoop,
        'realm-diagram': realmDiagram,
        'feedback-loop': feedbackLoop,
        'cognitive-load': cognitiveLoad,
        'liberation-pattern': liberationPattern,
        'stack-comparison': stackComparison,
        'xenonym-browser': xenonymBrowser,
        'presentation-architecture': presentationArchitecture,
        'tufte-timeline': tufteTimeline,
        'governing-principle': governingPrinciple,
        'blank-page': blankPage,
        'three-observations': threeObservations,
        'institutional-context': institutionalContext,
        'evaluation-cost': evaluationCost,
        'architectural-judgment': architecturalJudgment,
        'tacit-knowledge': tacitKnowledge,
        'syllabic-mixing': syllabicMixing,
        'wrong-question': wrongQuestion,
        'xenonym-synthesis': xenonymSynthesis,
        'ibis-flow': ibisFlow,
        'the-ask': theAsk,
        'learning-objectives': learningObjectives,
        'your-role': yourRole,
        'jig': jig,
        'metaphor-to-mechanism': metaphorToMechanism,
        'data-as-flow': dataFlowVsInventory,
        'research-iceberg': researchIceberg,
        'ideas-not-zombies': ideasNotZombies,
        'sheffield-parallel': sheffieldParallel,
        'ask-moves': theAskFiveLoupes,
        'question-returns': questionReturns,
        'two-orders-shift': twoOrdersShift,
        'compression-stack': compressionStack,
        'unlocked-zone': unlockedZone,
        'hersh-caveats': hershCaveats,
        'consent-form-iframe': consentFormIframe,
        'synthetic-patient-rig': syntheticPatientRig,
        'software-consumable': softwareConsumable,
        'applied-informatics': appliedInformatics,
        'regulatory-inversion': regulatoryInversion
    };

    // ===== The Regulatory Inversion — IEC 62304 traceability spine =====
    // Visualizes the paper's central thesis: the IEC 62304 lifecycle is
    // a five-stage traceability spine; AI lowered the cost of maintaining
    // it AND raised the cost of NOT maintaining it (drift toward plausibility).
    // What was a regulatory burden becomes the scaffold for AI-assisted
    // development of consequential software.
    function regulatoryInversion(container, config) {
        var W = 1280, H = 680;
        var bg       = '#faf7f1';
        var ink      = '#1f1a14';
        var muted    = '#6b5c48';
        var rule     = '#a89c85';
        var slate    = '#3d5b73';
        var slateDk  = '#1f3447';
        var copper   = '#a36015';
        var copperDk = '#7a460c';
        var crimsonDk= '#6b1f15';
        var green    = '#1d6b4a';
        var greenDk  = '#0e3f2c';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '88vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // Title + subtitle
        svg.append('text').attr('x', W / 2).attr('y', 50)
            .attr('text-anchor', 'middle')
            .attr('font-size', '28px').attr('font-weight', '700').attr('fill', ink)
            .attr('letter-spacing', '-0.02em')
            .text('The Regulatory Inversion');
        svg.append('text').attr('x', W / 2).attr('y', 80)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px').attr('font-style', 'italic').attr('fill', muted)
            .text('Burden → Scaffold. The IEC 62304 traceability spine becomes the discipline of consequential software.');

        // ===== THE SPINE =====
        svg.append('text').attr('x', W / 2).attr('y', 138)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('font-weight', '700').attr('fill', muted)
            .attr('letter-spacing', '2.5px')
            .text('THE TRACEABILITY SPINE');

        var stages = [
            { short: 'UN',  name: 'User Need',     sub: 'what the user is trying to accomplish' },
            { short: 'SR',  name: 'Requirement',   sub: 'what the software must do' },
            { short: 'SDS', name: 'Design',        sub: 'how the software is structured' },
            { short: 'RC',  name: 'Risk Control',  sub: 'what mitigates each hazard' },
            { short: 'V',   name: 'Verification',  sub: 'evidence the design meets the need' }
        ];
        var spineY = 240, sX = 140, eX = W - 140;
        var gap = (eX - sX) / (stages.length - 1);
        var nodeR = 38;

        // Forward connecting line
        svg.append('line')
            .attr('x1', sX).attr('y1', spineY).attr('x2', eX).attr('y2', spineY)
            .attr('stroke', ink).attr('stroke-width', 2);

        // Bidirectional traceability — dashed return arc
        svg.append('path')
            .attr('d', 'M ' + (sX + nodeR) + ' ' + (spineY + 20) +
                       ' Q ' + ((sX + eX) / 2) + ' ' + (spineY + 70) +
                       ' ' + (eX - nodeR) + ' ' + (spineY + 20))
            .attr('stroke', muted).attr('stroke-width', 1.2)
            .attr('stroke-dasharray', '5,4').attr('fill', 'none').attr('opacity', 0.55);
        svg.append('text').attr('x', W / 2).attr('y', spineY + 88)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('bidirectional — every test back-references the user need');

        stages.forEach(function (st, i) {
            var x = sX + i * gap;
            var color   = i === 0 ? slate   : (i === stages.length - 1 ? green   : copper);
            var colorDk = i === 0 ? slateDk : (i === stages.length - 1 ? greenDk : copperDk);

            // Stage name above the node
            svg.append('text').attr('x', x).attr('y', spineY - 60)
                .attr('text-anchor', 'middle')
                .attr('font-size', '15px').attr('font-weight', '700').attr('fill', colorDk)
                .text(st.name);
            svg.append('text').attr('x', x).attr('y', spineY - 42)
                .attr('text-anchor', 'middle')
                .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
                .text(st.sub);

            // Node
            svg.append('circle').attr('cx', x).attr('cy', spineY).attr('r', nodeR)
                .attr('fill', color).attr('stroke', ink).attr('stroke-width', 2);
            svg.append('text').attr('x', x).attr('y', spineY + 5)
                .attr('text-anchor', 'middle')
                .attr('font-size', '15px').attr('font-weight', '700').attr('fill', '#faf7f1')
                .attr('letter-spacing', '1px')
                .text(st.short);
        });

        // ===== Two-column inversion (YESTERDAY / TODAY) =====
        var invY = 400;
        var midX = W / 2;
        var colW = 480;

        // YESTERDAY (left)
        var yX = midX - 30 - colW;
        svg.append('text').attr('x', yX + colW).attr('y', invY)
            .attr('text-anchor', 'end')
            .attr('font-size', '12px').attr('font-weight', '700').attr('fill', crimsonDk)
            .attr('letter-spacing', '2px')
            .text('YESTERDAY');
        svg.append('text').attr('x', yX + colW).attr('y', invY + 24)
            .attr('text-anchor', 'end')
            .attr('font-size', '14px').attr('font-weight', '600').attr('fill', ink)
            .text('Maintaining the spine was expensive.');
        svg.append('text').attr('x', yX + colW).attr('y', invY + 46)
            .attr('text-anchor', 'end')
            .attr('font-size', '13px').attr('fill', muted)
            .text('Reception patterns: parallel · afterthought · burden.');
        svg.append('text').attr('x', yX + colW).attr('y', invY + 65)
            .attr('text-anchor', 'end')
            .attr('font-size', '13px').attr('fill', muted)
            .text('Documentation slowed delivery. Discipline was a tax.');

        // TODAY (right)
        var tX = midX + 30;
        svg.append('text').attr('x', tX).attr('y', invY)
            .attr('font-size', '12px').attr('font-weight', '700').attr('fill', greenDk)
            .attr('letter-spacing', '2px')
            .text('TODAY');
        svg.append('text').attr('x', tX).attr('y', invY + 24)
            .attr('font-size', '14px').attr('font-weight', '600').attr('fill', ink)
            .text('AI lowered the cost of having it.');
        svg.append('text').attr('x', tX).attr('y', invY + 46)
            .attr('font-size', '13px').attr('fill', muted)
            .text('AI raised the cost of not — code drifts toward plausibility.');
        svg.append('text').attr('x', tX).attr('y', invY + 65)
            .attr('font-size', '13px').attr('fill', muted)
            .text('The spine maintains itself; humans review the content.');

        // Center divider
        svg.append('line')
            .attr('x1', midX).attr('y1', invY - 12)
            .attr('x2', midX).attr('y2', invY + 78)
            .attr('stroke', rule).attr('stroke-width', 1)
            .attr('stroke-dasharray', '4,4').attr('opacity', 0.55);
        // Inversion arrow at center
        svg.append('text').attr('x', midX).attr('y', invY + 38)
            .attr('text-anchor', 'middle')
            .attr('font-size', '24px').attr('fill', copperDk).text('→');

        // ===== Bottom takeaway band =====
        var tbY = 530;
        svg.append('rect')
            .attr('x', 80).attr('y', tbY).attr('width', W - 160).attr('height', 80)
            .attr('rx', 6).attr('fill', '#fff8e6')
            .attr('stroke', copperDk).attr('stroke-width', 1.5).attr('stroke-opacity', 0.6);
        svg.append('text').attr('x', W / 2).attr('y', tbY + 30)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15px').attr('font-style', 'italic').attr('fill', muted)
            .text('Same minimum requirement. Lower cost of meeting it. Higher cost of not.');
        svg.append('text').attr('x', W / 2).attr('y', tbY + 58)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15.5px').attr('font-weight', '700').attr('fill', ink)
            .text('AI builds the code.   AI builds the proof.   Humans review both.');

        // Footer attribution
        svg.append('text').attr('x', W / 2).attr('y', H - 14)
            .attr('text-anchor', 'middle')
            .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text('Gershkovich P. From Burden to Scaffold — IEC 62304 and AI-Assisted Development of Decision-Supporting Software. Yale Pathology Informatics, 2026.   ·   IEC 62304:2006+A1:2015.');
    }

    // ===== Applied Informatics — Theory · Engineering · Practice =====
    // Three columns with the engineering column as the emphasized middle —
    // visualizing applied informatics as the translational layer between
    // biomedical-information science and clinical reality.
    function appliedInformatics(container, config) {
        var W = 1280, H = 680;
        var bg       = '#faf7f1';
        var ink      = '#1f1a14';
        var muted    = '#6b5c48';
        var rule     = '#a89c85';
        var slate    = '#3d5b73';
        var slateDk  = '#1f3447';
        var copper   = '#a36015';
        var copperDk = '#7a460c';
        var green    = '#1d6b4a';
        var greenDk  = '#0e3f2c';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '88vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // ===== Title + subtitle =====
        svg.append('text').attr('x', W / 2).attr('y', 44)
            .attr('text-anchor', 'middle')
            .attr('font-size', '24px').attr('font-weight', '700').attr('fill', ink)
            .attr('letter-spacing', '-0.01em')
            .text('Applied Informatics Is the Translational Layer');
        svg.append('text').attr('x', W / 2).attr('y', 72)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-style', 'italic').attr('fill', muted)
            .text('Informatics began as a science of biomedical information, but its clinical impact depends on engineered systems.');
        svg.append('line').attr('x1', 80).attr('y1', 92)
            .attr('x2', W - 80).attr('y2', 92)
            .attr('stroke', rule).attr('stroke-width', 1).attr('opacity', 0.5);

        // ===== Three columns =====
        var cols = [
            { num: '01', title: 'THEORY',
              tag: 'The science of biomedical information',
              color: slate, colorDk: slateDk, fill: 'rgba(61,91,115,0.06)',
              items: ['Models', 'Data structures', 'Algorithms', 'Terminology', 'Decision logic'] },
            { num: '02', title: 'ENGINEERING',
              tag: 'The translational layer',
              color: copper, colorDk: copperDk, fill: 'rgba(163,96,21,0.10)',
              items: ['Workflow-aware software', 'Interfaces', 'Security', 'Validation',
                      'Monitoring', 'Integration', 'Audit trails'],
              highlighted: true },
            { num: '03', title: 'PRACTICE',
              tag: 'Clinical reality',
              color: green, colorDk: greenDk, fill: 'rgba(29,107,74,0.06)',
              items: ['Clinician-facing tools', 'Operational adoption', 'Feedback',
                      'Measurable clinical improvement'] }
        ];

        var marginX = 60;
        var gap = 26;
        var colW = (W - 2 * marginX - 2 * gap) / 3;
        var colY = 122;
        var colH = 380;

        // Connector arrows behind cards
        [0, 1].forEach(function (i) {
            var startX = marginX + i * (colW + gap) + colW + 2;
            var endX = marginX + (i + 1) * (colW + gap) - 2;
            var midY = colY + colH / 2;
            svg.append('line')
                .attr('x1', startX).attr('y1', midY)
                .attr('x2', endX - 9).attr('y2', midY)
                .attr('stroke', muted).attr('stroke-width', 1.5).attr('stroke-opacity', 0.7);
            svg.append('path')
                .attr('d', 'M' + (endX - 9) + ',' + midY + ' l-10,-6 l0,12 z')
                .attr('fill', muted).attr('fill-opacity', 0.7);
        });

        cols.forEach(function (col, i) {
            var x = marginX + i * (colW + gap);
            // Card
            svg.append('rect')
                .attr('x', x).attr('y', colY)
                .attr('width', colW).attr('height', colH)
                .attr('rx', 6).attr('ry', 6)
                .attr('fill', col.fill)
                .attr('stroke', col.color)
                .attr('stroke-width', col.highlighted ? 2.2 : 1)
                .attr('stroke-opacity', col.highlighted ? 1 : 0.55);

            // Number eyebrow
            svg.append('text').attr('x', x + 22).attr('y', colY + 32)
                .attr('font-size', '13px').attr('font-weight', '700')
                .attr('fill', col.colorDk).attr('letter-spacing', '2px')
                .style('font-family', "'JetBrains Mono', 'Menlo', monospace")
                .text(col.num);

            // Title
            svg.append('text').attr('x', x + 22).attr('y', colY + 62)
                .attr('font-size', '20px').attr('font-weight', '700').attr('fill', col.colorDk)
                .attr('letter-spacing', '1.5px')
                .text(col.title);

            // Tag
            svg.append('text').attr('x', x + 22).attr('y', colY + 84)
                .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', muted)
                .text(col.tag);

            // Hairline divider
            svg.append('line').attr('x1', x + 22).attr('y1', colY + 102)
                .attr('x2', x + colW - 22).attr('y2', colY + 102)
                .attr('stroke', col.color).attr('stroke-width', 1).attr('stroke-opacity', 0.4);

            // Items
            var itemY = colY + 132;
            col.items.forEach(function (item) {
                svg.append('circle').attr('cx', x + 28).attr('cy', itemY - 4).attr('r', 2.6)
                    .attr('fill', col.color);
                svg.append('text').attr('x', x + 40).attr('y', itemY)
                    .attr('font-size', '14px').attr('fill', ink).attr('font-weight', '500')
                    .text(item);
                itemY += 28;
            });
        });

        // ===== Bottom punchline =====
        var pY = colY + colH + 56;
        svg.append('line').attr('x1', marginX).attr('y1', pY - 28)
            .attr('x2', W - marginX).attr('y2', pY - 28)
            .attr('stroke', rule).attr('stroke-width', 1).attr('opacity', 0.45);
        svg.append('text').attr('x', W / 2).attr('y', pY)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14.5px').attr('fill', muted).attr('font-style', 'italic')
            .text('Without applied informatics, discovery remains a paper.');
        svg.append('text').attr('x', W / 2).attr('y', pY + 26)
            .attr('text-anchor', 'middle')
            .attr('font-size', '15.5px').attr('font-weight', '700').attr('fill', ink)
            .text('With applied informatics, discovery becomes clinical infrastructure.');
        svg.append('line').attr('x1', marginX).attr('y1', pY + 46)
            .attr('x2', W - marginX).attr('y2', pY + 46)
            .attr('stroke', rule).attr('stroke-width', 1).attr('opacity', 0.45);

        // ===== Citations footer =====
        svg.append('text').attr('x', W / 2).attr('y', H - 18)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('fill', muted).attr('letter-spacing', '0.4px')
            .text('Lindberg 1986  ·  NLM IAIMS Program  ·  Shortliffe & Cimino — Biomedical Informatics  ·  Friedman 2009 — Fundamental Theorem  ·  AMIA — Clinical / Applied / Operational Informatics');
    }

    // ===== Software as Consumable, Not as Capital =====
    // Two horizontal lifecycle bands on a shared time axis: capital model
    // (one long-lived ribbon that ages into debt and abandonment) vs
    // consumable model (many short build/use/retire ribbons that complete
    // cleanly).  Same total engineering hours, different shape.
    function softwareConsumable(container, config) {
        var W = 1280, H = 620;
        var bg       = '#faf7f1';
        var ink      = '#1f1a14';
        var muted    = '#6b5c48';
        var rule     = '#a89c85';
        var slate    = '#3d5b73';
        var slateDk  = '#1f3447';
        var copper   = '#a36015';
        var copperDk = '#7a460c';
        var crimson  = '#9a3324';
        var taupe    = '#8a8170';
        var taupeDk  = '#5e564a';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '88vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // Layout
        var bandStartX = 280;
        var bandEndX   = W - 50;
        var bandW      = bandEndX - bandStartX;
        var bandH      = 60;
        var capitalY    = 130;
        var consumableY = 360;

        // ===== TIME AXIS (top) =====
        svg.append('text').attr('x', bandStartX).attr('y', 56)
            .attr('font-size', '10.5px').attr('font-weight', '700').attr('fill', muted)
            .attr('letter-spacing', '1.6px').text('YEAR ZERO');
        svg.append('text').attr('x', bandEndX).attr('y', 56)
            .attr('text-anchor', 'end')
            .attr('font-size', '10.5px').attr('font-weight', '700').attr('fill', muted)
            .attr('letter-spacing', '1.6px').text('TODAY');
        svg.append('line').attr('x1', bandStartX).attr('y1', 70).attr('x2', bandEndX).attr('y2', 70)
            .attr('stroke', rule).attr('stroke-width', 1).attr('stroke-dasharray', '3,4').attr('opacity', 0.5);

        // ===== CAPITAL BAND =====
        // Left labels (vertically centered with the band)
        svg.append('text').attr('x', 50).attr('y', capitalY + bandH / 2 - 6)
            .attr('font-size', '14px').attr('font-weight', '700').attr('fill', slateDk)
            .attr('letter-spacing', '1.3px').text('SOFTWARE AS');
        svg.append('text').attr('x', 50).attr('y', capitalY + bandH / 2 + 14)
            .attr('font-size', '14px').attr('font-weight', '700').attr('fill', slateDk)
            .attr('letter-spacing', '1.3px').text('CAPITAL');

        // The single long ribbon — 4 phases
        var capPhases = [
            { name: 'BUILD',     pct: 0.12, color: slate,    fill: 'rgba(61,91,115,0.50)' },
            { name: 'MAINTAIN',  pct: 0.45, color: copper,   fill: 'rgba(163,96,21,0.32)' },
            { name: 'DEBT',      pct: 0.25, color: crimson,  fill: 'rgba(154,51,36,0.28)' },
            { name: 'ABANDONED', pct: 0.18, color: taupeDk,  fill: 'rgba(94,86,74,0.32)' }
        ];
        var cx = bandStartX;
        capPhases.forEach(function (p) {
            var w = bandW * p.pct;
            svg.append('rect').attr('x', cx).attr('y', capitalY)
                .attr('width', w).attr('height', bandH)
                .attr('fill', p.fill).attr('stroke', p.color).attr('stroke-width', 1.2);
            if (w > 60) {
                svg.append('text').attr('x', cx + w / 2).attr('y', capitalY + bandH / 2 + 5)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '11.5px').attr('font-weight', '700').attr('fill', p.color)
                    .attr('letter-spacing', '1.6px').text(p.name);
            }
            cx += w;
        });

        // Caption below capital band
        svg.append('text').attr('x', bandStartX).attr('y', capitalY + bandH + 22)
            .attr('font-size', '12px').attr('fill', muted).attr('font-style', 'italic')
            .text('Build once  ·  maintain forever  ·  inherit the debt  ·  eventually join the graveyard.');

        // ===== MIDDLE ANNOTATION =====
        var midY = (capitalY + bandH + consumableY) / 2;
        svg.append('line').attr('x1', 60).attr('y1', midY - 32)
            .attr('x2', W - 60).attr('y2', midY - 32)
            .attr('stroke', rule).attr('stroke-width', 1).attr('opacity', 0.4);
        svg.append('text').attr('x', W / 2).attr('y', midY - 8)
            .attr('text-anchor', 'middle').attr('font-size', '14.5px').attr('font-weight', '700').attr('fill', ink)
            .text('Same total engineering hours.  Different shape.  Different outcome.');
        svg.append('text').attr('x', W / 2).attr('y', midY + 16)
            .attr('text-anchor', 'middle').attr('font-size', '13px').attr('font-style', 'italic').attr('fill', copperDk)
            .text('AI didn’t invent this idea. It just made it obvious.');
        svg.append('line').attr('x1', 60).attr('y1', midY + 32)
            .attr('x2', W - 60).attr('y2', midY + 32)
            .attr('stroke', rule).attr('stroke-width', 1).attr('opacity', 0.4);

        // ===== CONSUMABLE BAND =====
        svg.append('text').attr('x', 50).attr('y', consumableY + bandH / 2 - 6)
            .attr('font-size', '14px').attr('font-weight', '700').attr('fill', copperDk)
            .attr('letter-spacing', '1.3px').text('SOFTWARE AS');
        svg.append('text').attr('x', 50).attr('y', consumableY + bandH / 2 + 14)
            .attr('font-size', '14px').attr('font-weight', '700').attr('fill', copperDk)
            .attr('letter-spacing', '1.3px').text('CONSUMABLE');

        // Many short ribbons, each build → use → retire
        var nRibbons = 9;
        var ribbonGap = 10;
        var ribbonW = (bandW - (nRibbons - 1) * ribbonGap) / nRibbons;
        var subs = [
            { pct: 0.30, color: slate,  fill: 'rgba(61,91,115,0.55)' },
            { pct: 0.45, color: copper, fill: 'rgba(163,96,21,0.55)' },
            { pct: 0.25, color: muted,  fill: 'rgba(107,92,72,0.30)' }
        ];
        for (var r = 0; r < nRibbons; r++) {
            var rx = bandStartX + r * (ribbonW + ribbonGap);
            var sx = rx;
            subs.forEach(function (s) {
                var w = ribbonW * s.pct;
                svg.append('rect').attr('x', sx).attr('y', consumableY)
                    .attr('width', w).attr('height', bandH)
                    .attr('fill', s.fill).attr('stroke', s.color).attr('stroke-width', 0.9);
                sx += w;
            });
        }

        // Caption + tiny inline legend below consumable band
        svg.append('text').attr('x', bandStartX).attr('y', consumableY + bandH + 22)
            .attr('font-size', '12px').attr('fill', muted).attr('font-style', 'italic')
            .text('Build for a question  ·  use it  ·  retire it cleanly.  Nothing inherited; nothing abandoned.');

        var legX = bandEndX - 230;
        var legY = consumableY + bandH + 22;
        var legItems = [
            { label: 'build',  color: slate },
            { label: 'use',    color: copper },
            { label: 'retire', color: muted }
        ];
        legItems.forEach(function (item) {
            svg.append('rect').attr('x', legX).attr('y', legY - 9)
                .attr('width', 12).attr('height', 9)
                .attr('fill', item.color).attr('fill-opacity', 0.55)
                .attr('stroke', item.color).attr('stroke-width', 1);
            svg.append('text').attr('x', legX + 18).attr('y', legY)
                .attr('font-size', '11px').attr('fill', muted).text(item.label);
            legX += 78;
        });

        // ===== Bottom attribution =====
        svg.append('text').attr('x', W / 2).attr('y', H - 18)
            .attr('text-anchor', 'middle').attr('font-size', '11px').attr('font-style', 'italic').attr('fill', muted)
            .text('McQuade et al., Defense Innovation Board (2019) — “Software Is Never Done.” The argument that software is a service, not a capital asset, predates the AI revolution by half a decade.');
    }

    // ===== Synthetic Patient Problem — three specimen lanes through a 5-station rig =====
    function syntheticPatientRig(container, config) {
        var W = 1280, H = 630;
        var bg       = '#faf7f1';
        var ink      = '#1f1a14';
        var muted    = '#6b5c48';
        var slate    = '#3d5b73';   // safe + considered (synthetic)
        var slateDk  = '#1f3447';
        var crimson  = '#9a3324';   // unsafe (real data)
        var crimsonDk= '#6b1f15';
        var taupe    = '#8a8170';   // meaningless (toy data)
        var taupeDk  = '#5e564a';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '88vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        // Hatched pattern for the closed-gate REAL lane
        var defs = svg.append('defs');
        var pat = defs.append('pattern').attr('id', 'syn-hatch')
            .attr('width', 8).attr('height', 8).attr('patternUnits', 'userSpaceOnUse')
            .attr('patternTransform', 'rotate(45)');
        pat.append('rect').attr('width', 8).attr('height', 8).attr('fill', 'rgba(154,51,36,0.07)');
        pat.append('line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 8)
            .attr('stroke', crimson).attr('stroke-width', 1).attr('stroke-opacity', 0.45);

        // ===== TEST RIG (top) =====
        var stations = ['Names', 'Search', 'Display', 'Validation', 'Integration'];
        var n = stations.length;
        var rigStartX = 360;
        var rigEndX   = W - 200;
        var stationGap = (rigEndX - rigStartX) / (n - 1);
        var rigY = 42;   // hoisted 50px (was 92) — title is gone, slide gives this room back

        svg.append('line')
            .attr('x1', rigStartX - 30).attr('y1', rigY)
            .attr('x2', rigEndX + 30).attr('y2', rigY)
            .attr('stroke', ink).attr('stroke-width', 1.5);

        stations.forEach(function (name, i) {
            var x = rigStartX + i * stationGap;
            // Numbered station node
            svg.append('circle').attr('cx', x).attr('cy', rigY).attr('r', 18)
                .attr('fill', '#ffffff').attr('stroke', ink).attr('stroke-width', 2);
            svg.append('text').attr('x', x).attr('y', rigY + 5)
                .attr('text-anchor', 'middle').attr('font-size', '13px').attr('font-weight', '700').attr('fill', ink)
                .text(i + 1);
            // Station name above
            svg.append('text').attr('x', x).attr('y', rigY - 28)
                .attr('text-anchor', 'middle').attr('font-size', '13px').attr('font-weight', '600').attr('fill', ink)
                .text(name);
        });

        // ===== THREE SPECIMEN LANES =====
        var lanes = [
            { id: 'real',  label: 'REAL PATIENT DATA', tag: 'Realistic, but unsafe',
              color: crimson, colorDk: crimsonDk, bgFill: 'rgba(154,51,36,0.04)',
              mode: 'gate-closed',
              gateText: 'GATE CLOSED  ·  HIPAA  ·  IRB  ·  AUDIT  ·  DUA',
              note: 'Must remain local. Must remain safe.',
              verdict: 'HIGH RISK' },

            { id: 'synthetic', label: 'SYNTHETIC TEST DATA', tag: 'Safe, structured, adversarial',
              color: slate, colorDk: slateDk, bgFill: 'rgba(61,91,115,0.08)',
              mode: 'cells',
              marks: ['✓','✓','✓','✓','✓'],
              note: 'Nontra Null. Edge-case names. Cohorts shaped like real ones, owned by no one.',
              verdict: 'PASSES — AND PUSHES BACK',
              highlighted: true },

            { id: 'toy', label: 'TOY DATA', tag: 'Safe, but meaningless',
              color: taupe, colorDk: taupeDk, bgFill: 'rgba(138,129,112,0.05)',
              mode: 'cells',
              marks: ['✓','✗','✗','✗','✗'],
              note: 'John Doe. Jane Doe. X1, X2. Passes the gate because nothing real ever pushed it.',
              verdict: 'PASSES, PROVES NOTHING' }
        ];

        var laneStartY = 130;   // hoisted 50px (was 180)
        var laneH = 130;
        var laneGap = 14;

        lanes.forEach(function (lane, li) {
            var y = laneStartY + li * (laneH + laneGap);

            // Lane card
            svg.append('rect')
                .attr('x', 50).attr('y', y).attr('width', W - 100).attr('height', laneH)
                .attr('rx', 6).attr('ry', 6)
                .attr('fill', lane.bgFill)
                .attr('stroke', lane.color)
                .attr('stroke-width', lane.highlighted ? 2 : 1)
                .attr('stroke-opacity', lane.highlighted ? 1 : 0.45);

            // Specimen avatar (chart card with patient head)
            var avX = 105, avY = y + laneH / 2;
            // Head
            svg.append('circle').attr('cx', avX).attr('cy', avY - 36).attr('r', 9)
                .attr('fill', '#ffffff').attr('stroke', lane.color).attr('stroke-width', 1.5);
            // Chart card
            svg.append('rect').attr('x', avX - 22).attr('y', avY - 24)
                .attr('width', 44).attr('height', 50).attr('rx', 3)
                .attr('fill', '#ffffff').attr('stroke', lane.color).attr('stroke-width', 1.5);
            for (var k = 0; k < 4; k++) {
                svg.append('line').attr('x1', avX - 14).attr('x2', avX + 14)
                    .attr('y1', avY - 16 + k * 8).attr('y2', avY - 16 + k * 8)
                    .attr('stroke', lane.color).attr('stroke-width', 1).attr('stroke-opacity', 0.45);
            }

            // Label + tag (top-left of card)
            svg.append('text').attr('x', 160).attr('y', y + 28)
                .attr('font-size', '13.5px').attr('font-weight', '700')
                .attr('fill', lane.colorDk).attr('letter-spacing', '1.4px')
                .text(lane.label);
            svg.append('text').attr('x', 160).attr('y', y + 48)
                .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', muted)
                .text(lane.tag);

            // Verdict (top-right of card)
            svg.append('text').attr('x', W - 70).attr('y', y + 28)
                .attr('text-anchor', 'end')
                .attr('font-size', '11.5px').attr('font-weight', '700').attr('fill', lane.colorDk)
                .attr('letter-spacing', '1.5px')
                .text(lane.verdict);

            if (lane.mode === 'gate-closed') {
                // Hatched bar across the cell zone — visualizes the lane never opening
                var barX = rigStartX - 28;
                var barW = (rigEndX + 28) - barX;
                svg.append('rect')
                    .attr('x', barX).attr('y', y + laneH / 2 - 22)
                    .attr('width', barW).attr('height', 44).attr('rx', 4)
                    .attr('fill', 'url(#syn-hatch)')
                    .attr('stroke', lane.color).attr('stroke-width', 1.4);
                svg.append('text')
                    .attr('x', barX + barW / 2).attr('y', y + laneH / 2 + 6)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '13px').attr('font-weight', '700')
                    .attr('fill', lane.colorDk).attr('letter-spacing', '2.2px')
                    .text(lane.gateText);
            } else {
                // Pass/fail cells aligned with rig stations above
                lane.marks.forEach(function (mark, i) {
                    var x = rigStartX + i * stationGap;
                    var pass = mark === '✓';
                    var cellColor = pass ? slate : lane.color;
                    var cellFill = pass
                        ? 'rgba(61,91,115,0.10)'
                        : (lane.color === crimson ? 'rgba(154,51,36,0.08)' : 'rgba(138,129,112,0.10)');
                    svg.append('rect')
                        .attr('x', x - 22).attr('y', y + laneH / 2 - 22)
                        .attr('width', 44).attr('height', 44).attr('rx', 4)
                        .attr('fill', cellFill)
                        .attr('stroke', cellColor).attr('stroke-width', 1.3);
                    svg.append('text')
                        .attr('x', x).attr('y', y + laneH / 2 + 8)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '22px').attr('font-weight', '700').attr('fill', cellColor)
                        .text(mark);
                });
            }

            // Note (bottom-left of card)
            svg.append('text').attr('x', 160).attr('y', y + laneH - 16)
                .attr('font-size', '11.5px').attr('font-style', 'italic').attr('fill', muted)
                .text(lane.note);
        });

        // ===== Bottom annotation =====
        svg.append('text').attr('x', W / 2).attr('y', H - 22)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-style', 'italic').attr('fill', muted)
            .text('Synthetic data is not decoration. It is the test harness for clinical AI engineering.');
    }

    // ===== Scrollable iframe for the Yale informed-consent form =====
    // Renders centered on a light-gray full-bleed canvas, with a small
    // hover-only affordance that reveals the generation prompt.
    function consentFormIframe(container, config) {
        var src = (config && config.src) || 'assets/yale-consent-form.html';
        var height = (config && config.height) || '82vh';
        var promptHover = (config && config.promptHover) || null;

        // Repaint the slide section in light gray so the form sits on a
        // calm neutral field instead of the deck's default surface.
        var section = container.closest('section');
        if (section) {
            section.style.background = '#ECECEC';
            section.setAttribute('data-background-color', '#ECECEC');
        }

        // Full-bleed gray stage
        var stage = document.createElement('div');
        stage.style.cssText =
            'position:relative;width:100%;height:100%;' +
            'display:flex;align-items:center;justify-content:center;' +
            'background:#ECECEC;';

        // Centered form card
        var wrapper = document.createElement('div');
        wrapper.style.cssText =
            'width:100%;max-width:1240px;margin:0 auto;' +
            'box-shadow:0 8px 32px rgba(0,0,0,0.14);' +
            'border-radius:6px;overflow:hidden;border:1px solid #d6cfbf;' +
            'background:#FAF8F3;';

        var frame = document.createElement('iframe');
        frame.src = src;
        frame.title = 'Yale Informed Consent — Research Participation';
        frame.setAttribute('loading', 'lazy');
        frame.style.cssText =
            'width:100%;height:' + height + ';border:0;display:block;background:#FAF8F3;';

        wrapper.appendChild(frame);
        stage.appendChild(wrapper);

        // Hover-only affordance — small "i" mark, top-right of the gray stage
        if (promptHover) {
            var info = document.createElement('div');
            info.style.cssText =
                'position:absolute;top:18px;right:22px;' +
                'width:26px;height:26px;border-radius:50%;' +
                'display:flex;align-items:center;justify-content:center;' +
                'background:#ffffff;border:1px solid #B8B0A0;' +
                'color:#4A4538;font-family:\'Spectral\',Georgia,serif;' +
                'font-style:italic;font-weight:600;font-size:14px;' +
                'cursor:help;user-select:none;' +
                'transition:background 0.15s,border-color 0.15s,color 0.15s;' +
                'z-index:5;';
            info.textContent = 'i';

            var pop = document.createElement('div');
            pop.style.cssText =
                'position:absolute;top:54px;right:22px;' +
                'width:380px;padding:18px 22px;' +
                'background:#ffffff;border:1px solid #4A4538;' +
                'box-shadow:0 6px 22px rgba(0,0,0,0.16);' +
                'opacity:0;pointer-events:none;' +
                'transition:opacity 0.18s ease;' +
                'z-index:6;';

            var eyebrow = document.createElement('div');
            eyebrow.textContent = 'GENERATED IN ~2 MINUTES WITH THIS PROMPT';
            eyebrow.style.cssText =
                'font-family:\'IBM Plex Sans\',system-ui,sans-serif;' +
                'font-size:9.5px;font-weight:700;letter-spacing:2px;' +
                'color:#6B6457;text-transform:uppercase;margin-bottom:10px;';
            pop.appendChild(eyebrow);

            var rule = document.createElement('div');
            rule.style.cssText =
                'border-top:1px solid #4A4538;width:100%;' +
                'opacity:0.4;margin-bottom:12px;';
            pop.appendChild(rule);

            var promptText = document.createElement('div');
            promptText.textContent = '“' + promptHover + '”';
            promptText.style.cssText =
                'font-family:\'Spectral\',Georgia,serif;' +
                'font-size:14px;line-height:1.55;color:#141414;' +
                'font-style:italic;';
            pop.appendChild(promptText);

            info.addEventListener('mouseenter', function () {
                info.style.background = '#4A4538';
                info.style.borderColor = '#4A4538';
                info.style.color = '#ffffff';
                pop.style.opacity = '1';
            });
            info.addEventListener('mouseleave', function () {
                info.style.background = '#ffffff';
                info.style.borderColor = '#B8B0A0';
                info.style.color = '#4A4538';
                pop.style.opacity = '0';
            });

            stage.appendChild(info);
            stage.appendChild(pop);
        }

        container.appendChild(stage);
    }

    // ===== Hersh 2013 Caveats — interactive DIKW pipeline with hover examples =====
    function hershCaveats(container, config) {
        // Combined slide: a literature timeline strip on top, the full Hersh
        // DIKW figure (all seven caveats in their original placement) below,
        // hover-detail panel at bottom. Replaces the slim 4-caveat version
        // and absorbs the standalone literature-pivot slide.
        var W = 1280, H = 720;
        var bg = '#faf7f1';
        var ink = '#1f1a14';
        var muted = '#6b5c48';
        var rule = '#a89c85';
        var amber = '#b8860b';
        var amberBg = '#fef3c7';
        var amberStroke = '#d97706';
        var amberStrong = '#92400e';
        var blueBox = '#dde7f0';
        var blueStroke = '#1B3A5C';
        var arrowGrey = '#7a8896';

        var svg = d3.select(container).append('svg')
            .attr('viewBox', '0 0 ' + W + ' ' + H)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .style('max-width', '100%').style('max-height', '88vh')
            .style('font-family', "'Inter', 'Helvetica Neue', sans-serif");
        svg.append('rect').attr('width', W).attr('height', H).attr('fill', bg);

        if (!config || !config.hideHeader) {
            svg.append('text').attr('x', W / 2).attr('y', 24)
                .attr('text-anchor', 'middle')
                .attr('font-size', '22px').attr('font-weight', '700').attr('fill', ink)
                .text('What the Literature Already Knows');
            svg.append('text').attr('x', W / 2).attr('y', 46)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12.5px').attr('font-style', 'italic').attr('fill', muted)
                .text('Thirteen years of EHR-data-quality literature, organized by Hersh’s DIKW continuum. Hover any caveat for the example from Table 1.');
        }

        // ===== Literature timeline strip (top) =====
        var tlY = 78;
        var tlMarkers = [
            { x: 200,  year: '2013', author: 'HERSH',           tag: 'seven caveats catalog' },
            { x: 445,  year: '2013', author: 'WEISKOPF & WENG', tag: 'five quality dimensions' },
            { x: 690,  year: '2016', author: 'DATA ENGINEERING',     tag: 'the engineered substrate' },
            { x: 935,  year: '2026', author: 'WORKFLOW ORCHESTRATION', tag: 'the modern theme' },
            { x: 1180, year: '…',    author: '',                tag: 'and the literature keeps adding' }
        ];
        // Connecting line spans all five markers
        svg.append('line')
            .attr('x1', 180).attr('y1', tlY)
            .attr('x2', 1180).attr('y2', tlY)
            .attr('stroke', amberStroke).attr('stroke-width', 1.4).attr('stroke-opacity', 0.6);
        tlMarkers.forEach(function (m) {
            // Dot
            svg.append('circle').attr('cx', m.x).attr('cy', tlY).attr('r', 5)
                .attr('fill', amberStroke).attr('opacity', m.author === '' ? 0.5 : 1);
            // Year above
            svg.append('text').attr('x', m.x).attr('y', tlY - 12)
                .attr('text-anchor', 'middle')
                .attr('font-size', '12px').attr('font-weight', '700').attr('fill', amberStrong)
                .style('font-family', "'JetBrains Mono', 'Menlo', monospace")
                .attr('letter-spacing', '1.5px').text(m.year);
            // Author below dot
            if (m.author) {
                svg.append('text').attr('x', m.x).attr('y', tlY + 18)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '11px').attr('font-weight', '700').attr('fill', ink)
                    .attr('letter-spacing', '1.2px').text(m.author);
            }
            // Tag below author
            svg.append('text').attr('x', m.x).attr('y', tlY + 32)
                .attr('text-anchor', 'middle')
                .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', muted)
                .text(m.tag);
        });
        // Faint divider below timeline
        svg.append('line').attr('x1', 60).attr('y1', tlY + 50)
            .attr('x2', W - 60).attr('y2', tlY + 50)
            .attr('stroke', rule).attr('stroke-width', 1).attr('opacity', 0.35);

        // ===== DIKW spine (center) — compressed spacing + shifted up so the
        // hover popup below clears the takeaway ribbon at slide bottom. =====
        var cx = 640;
        var dataY = 152;
        var infoY = 247;
        var knowY = 342;
        var boxW = 220, boxH = 50;

        // Vertical translucent shaft
        svg.append('line')
            .attr('x1', cx).attr('y1', dataY - 18).attr('x2', cx).attr('y2', knowY + boxH + 18)
            .attr('stroke', arrowGrey).attr('stroke-width', 30).attr('stroke-opacity', 0.14)
            .attr('stroke-linecap', 'round');

        var boxes = [
            { label: 'Data', y: dataY, sub: '' },
            { label: 'Information', y: infoY, sub: 'data + meaning' },
            { label: 'Knowledge', y: knowY, sub: '' }
        ];
        boxes.forEach(function (b) {
            svg.append('rect')
                .attr('x', cx - boxW / 2).attr('y', b.y)
                .attr('width', boxW).attr('height', boxH)
                .attr('rx', 5).attr('ry', 5)
                .attr('fill', blueBox).attr('stroke', blueStroke).attr('stroke-width', 1.6);
            svg.append('text')
                .attr('x', cx).attr('y', b.y + boxH / 2 + (b.sub ? -2 : 6))
                .attr('text-anchor', 'middle')
                .attr('font-size', '18px').attr('font-weight', '700').attr('fill', blueStroke)
                .text(b.label);
            if (b.sub) {
                svg.append('text')
                    .attr('x', cx).attr('y', b.y + boxH / 2 + 18)
                    .attr('text-anchor', 'middle')
                    .attr('font-size', '11px').attr('font-style', 'italic').attr('fill', '#475467')
                    .text(b.sub);
            }
        });

        // Arrowhead under Knowledge
        var arrowY = knowY + boxH + 12;
        svg.append('path')
            .attr('d', 'M ' + (cx - 14) + ' ' + arrowY + ' L ' + cx + ' ' + (arrowY + 22) + ' L ' + (cx + 14) + ' ' + arrowY + ' Z')
            .attr('fill', arrowGrey).attr('opacity', 0.55);

        // ===== Caveats — restored to all SEVEN in Hersh's original placement =====
        // LEFT side: #1, #4 → Data; #2 → Information; #5 → Knowledge
        // RIGHT side: #7 → Data; #3, #6 → Information
        var caveats = [
            // LEFT COLUMN
            { n: 1, label: 'Inaccurate data', side: 'L', y: 120, target: dataY + boxH / 2 - 8,
              full: 'EHRs may contain inaccurate (incorrect) data.',
              row: 'Diagnostic uncertainty',
              example: 'A patient with suspected diabetes mellitus may have a diabetes code recorded before the diagnosis is confirmed by laboratory testing.' },
            { n: 4, label: 'Locked in free text', side: 'L', y: 195, target: dataY + boxH / 2 + 8,
              full: 'Data captured in text in EHRs may not be recoverable for comparative effectiveness research.',
              row: 'Treatment choice and timing',
              example: 'The clinical reason for choosing an ACE inhibitor in a hypertensive patient — e.g., concomitant heart failure — may be recorded only later, in narrative text.' },
            { n: 2, label: 'Incomplete patient story', side: 'L', y: 270, target: infoY + boxH / 2, secondaryTarget: dataY + boxH / 2 + 4,
              full: 'EHRs often do not tell a complete patient story.',
              row: 'Diagnostic timing',
              example: 'A new patient in the system with diabetes may have had diabetes for many years prior to presentation — the EHR sees only the first encounter.' },
            { n: 5, label: 'Mixed provenance', side: 'L', y: 358, target: knowY + boxH / 2, secondaryTarget: dataY + boxH / 2 + 8,
              full: 'Multiple sources of data affect data provenance.',
              row: 'Treatment decisions',
              example: 'Some treatment decisions are remote to the patient–provider interaction — e.g., insurance restrictions or institutional drug formularies — and aren’t visible as such in the chart.' },
            // RIGHT COLUMN
            { n: 7, label: 'Care ≠ research', side: 'R', y: 120, target: dataY + boxH / 2, secondaryTarget: infoY + boxH / 2 - 8,
              full: 'There are differences between research protocols and clinical care.',
              row: 'Treatment decisions',
              example: 'Treatment decisions are not randomized. A physician may choose a treatment based on personal views or biases — not the cohort logic of a trial.' },
            { n: 3, label: 'Transformed / re-coded', side: 'R', y: 215, target: infoY + boxH / 2 - 8,
              full: 'Data have been transformed / coded for purposes other than clinical care and research.',
              row: 'Treatment decisions',
              example: 'A medication record may reflect what the insurance formulary or institution allowed — what was billable, not necessarily what the clinician would have chosen.' },
            { n: 6, label: 'Wrong granularity', side: 'R', y: 295, target: infoY + boxH / 2 + 8,
              full: 'Data granularity in EHRs may not match the needs of comparative effectiveness research.',
              row: 'Diagnostic uncertainty',
              example: 'Various forms of upper respiratory infection — sinusitis, pharyngitis, bronchitis, rhinitis — collapse into one billing code, erasing distinctions a researcher needs.' }
        ];

        var bubW = 280, bubH = 60;
        var leftX = 50, rightX = W - 50 - bubW;

        var bubGroup = svg.append('g').attr('class', 'caveat-bubbles');

        // Connectors first (behind bubbles)
        // PRIMARY influence = solid line (matches Hersh figure)
        // SECONDARY influence = dashed line (matches Hersh figure for caveats #2, #5, #7)
        caveats.forEach(function (d) {
            var bx = d.side === 'L' ? leftX + bubW : rightX;
            var by = d.y + bubH / 2;
            var tx = d.side === 'L' ? cx - boxW / 2 : cx + boxW / 2;
            var midX = (bx + tx) / 2;

            // PRIMARY (solid)
            var ty = d.target;
            bubGroup.append('path')
                .attr('class', 'connector connector-' + d.n)
                .attr('d', 'M ' + bx + ' ' + by + ' Q ' + midX + ' ' + by + ' ' + tx + ' ' + ty)
                .attr('stroke', amberStroke).attr('stroke-width', 1.3)
                .attr('fill', 'none').attr('stroke-opacity', 0.6);

            // SECONDARY (dashed) — only if defined
            if (d.secondaryTarget !== undefined) {
                var ty2 = d.secondaryTarget;
                var midY2 = (by + ty2) / 2;
                bubGroup.append('path')
                    .attr('class', 'connector-secondary connector-secondary-' + d.n)
                    .attr('d', 'M ' + bx + ' ' + by + ' Q ' + midX + ' ' + midY2 + ' ' + tx + ' ' + ty2)
                    .attr('stroke', amberStroke).attr('stroke-width', 1)
                    .attr('stroke-dasharray', '5,3')
                    .attr('fill', 'none').attr('stroke-opacity', 0.35);
            }
        });

        // Bubbles
        var bubs = bubGroup.selectAll('g.caveat')
            .data(caveats).enter()
            .append('g')
            .attr('class', function (d) { return 'caveat caveat-' + d.n; })
            .style('cursor', 'pointer');

        bubs.append('rect')
            .attr('class', 'bubble-bg')
            .attr('x', function (d) { return d.side === 'L' ? leftX : rightX; })
            .attr('y', function (d) { return d.y; })
            .attr('width', bubW).attr('height', bubH)
            .attr('rx', 7).attr('ry', 7)
            .attr('fill', amberBg).attr('stroke', amberStroke).attr('stroke-width', 1.5);

        bubs.append('circle')
            .attr('cx', function (d) { return d.side === 'L' ? leftX + 24 : rightX + bubW - 24; })
            .attr('cy', function (d) { return d.y + bubH / 2; })
            .attr('r', 15).attr('fill', amberStrong).attr('stroke', amberStroke).attr('stroke-width', 1);
        bubs.append('text')
            .attr('x', function (d) { return d.side === 'L' ? leftX + 24 : rightX + bubW - 24; })
            .attr('y', function (d) { return d.y + bubH / 2 + 5; })
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px').attr('font-weight', '700').attr('fill', '#fef3c7')
            .text(function (d) { return d.n; });

        bubs.append('text')
            .attr('x', function (d) { return d.side === 'L' ? leftX + 50 : rightX + bubW - 50; })
            .attr('y', function (d) { return d.y + bubH / 2 + 5; })
            .attr('text-anchor', function (d) { return d.side === 'L' ? 'start' : 'end'; })
            .attr('font-size', '15px').attr('font-weight', '600').attr('fill', '#5a4a1f')
            .text(function (d) { return d.label; });

        // ===== Floating hover popup bubble (hidden by default) =====
        // Bauhaus-style: white fill, hairline amber border, color block + caveat
        // number top-left, header in caps with letter-spacing, hairline accent
        // rule, full text, and the concrete Hersh-Table-1 example. No persistent
        // panel; the bubble materializes only when a caveat is hovered.
        var popupW = 660, popupH = 140;
        var popupX = (W - popupW) / 2;
        var popupY = 440;

        var popup = svg.append('g').attr('class', 'caveat-popup')
            .style('opacity', 0).style('pointer-events', 'none');

        // Bubble background — white with subtle drop shadow via two stacked rects
        popup.append('rect')
            .attr('x', popupX + 2).attr('y', popupY + 4)
            .attr('width', popupW).attr('height', popupH)
            .attr('rx', 8).attr('ry', 8)
            .attr('fill', '#000').attr('fill-opacity', 0.10);
        popup.append('rect')
            .attr('x', popupX).attr('y', popupY)
            .attr('width', popupW).attr('height', popupH)
            .attr('rx', 8).attr('ry', 8)
            .attr('fill', '#ffffff')
            .attr('stroke', amberStroke).attr('stroke-width', 1.8);

        // Number badge (color block, vertically aligned with the heading line)
        popup.append('rect')
            .attr('x', popupX + 16).attr('y', popupY + 16)
            .attr('width', 28).attr('height', 22)
            .attr('rx', 3)
            .attr('fill', amberStrong);
        var popupNumber = popup.append('text')
            .attr('x', popupX + 30).attr('y', popupY + 33)
            .attr('text-anchor', 'middle')
            .attr('font-size', '13px').attr('font-weight', '700').attr('fill', '#fef3c7');

        // Heading = the full caveat text itself (was a redundant CAPS label before).
        // Sized as the headline of the popup; wraps to two lines for the longer caveats.
        var popupFull = popup.append('text')
            .attr('x', popupX + 56).attr('y', popupY + 33)
            .attr('font-size', '15.5px').attr('font-weight', '700').attr('fill', ink);

        // Hairline accent rule (sits below a possible 2-line heading)
        popup.append('line')
            .attr('x1', popupX + 16).attr('x2', popupX + popupW - 16)
            .attr('y1', popupY + 70).attr('y2', popupY + 70)
            .attr('stroke', amberStroke).attr('stroke-width', 0.7).attr('stroke-opacity', 0.55);

        // Example label
        var popupExLabel = popup.append('text')
            .attr('x', popupX + 16).attr('y', popupY + 88)
            .attr('font-size', '10.5px').attr('font-weight', '700').attr('fill', muted)
            .attr('letter-spacing', '1.4px');

        // Example italic body — gets the freed space (room for two wrapped lines)
        var popupEx = popup.append('text')
            .attr('x', popupX + 16).attr('y', popupY + 108)
            .attr('font-size', '13.5px').attr('font-style', 'italic').attr('fill', '#3a2f1d');

        function wrapText(textSel, text, maxWidth, lineHeight) {
            textSel.selectAll('tspan').remove();
            textSel.text(null);
            var words = text.split(/\s+/);
            var x = textSel.attr('x'), y = textSel.attr('y');
            var line = [];
            var tspan = textSel.append('tspan').attr('x', x).attr('y', y);
            for (var i = 0; i < words.length; i++) {
                line.push(words[i]);
                tspan.text(line.join(' '));
                if (tspan.node().getComputedTextLength() > maxWidth && line.length > 1) {
                    line.pop();
                    tspan.text(line.join(' '));
                    line = [words[i]];
                    tspan = textSel.append('tspan').attr('x', x).attr('dy', lineHeight + 'px').text(words[i]);
                }
            }
        }

        // Hover handler — emphasize active caveat, dim others, light up its
        // primary (solid) and secondary (dashed) connectors, fade in popup.
        bubs.on('mouseenter', function (event, d) {
            bubGroup.selectAll('g.caveat').style('opacity', 0.32);
            bubGroup.selectAll('path.connector').attr('stroke-opacity', 0.10);
            bubGroup.selectAll('path.connector-secondary').attr('stroke-opacity', 0.08);
            d3.select(this).style('opacity', 1);
            d3.select(this).select('rect.bubble-bg').attr('stroke-width', 2.8);
            bubGroup.select('path.connector-' + d.n)
                .attr('stroke-opacity', 1).attr('stroke-width', 2.2);
            if (d.secondaryTarget !== undefined) {
                bubGroup.select('path.connector-secondary-' + d.n)
                    .attr('stroke-opacity', 0.85).attr('stroke-width', 1.5);
            }

            popupNumber.text(d.n);
            // Heading = the caveat's full statement (max width accounts for the
            // color-block on the left, so wrap budget is popupW - 56 - 16).
            wrapText(popupFull, d.full, popupW - 72, 18);
            popupExLabel.text('HERSH TABLE 1  ·  ' + d.row.toUpperCase());
            wrapText(popupEx, d.example, popupW - 32, 17);

            popup.transition().duration(180).style('opacity', 1);
        }).on('mouseleave', function () {
            bubGroup.selectAll('g.caveat').style('opacity', 1);
            bubGroup.selectAll('path.connector')
                .attr('stroke-opacity', 0.6).attr('stroke-width', 1.3);
            bubGroup.selectAll('path.connector-secondary')
                .attr('stroke-opacity', 0.35).attr('stroke-width', 1);
            bubGroup.selectAll('rect.bubble-bg').attr('stroke-width', 1.5);
            popup.transition().duration(140).style('opacity', 0);
        });

        // Legend matching the original Hersh figure — primary (solid) vs secondary (dashed)
        var legX = 80, legY = H - 110;
        svg.append('text').attr('x', legX).attr('y', legY)
            .attr('font-size', '10px').attr('font-weight', '700').attr('fill', muted)
            .attr('letter-spacing', '1.6px').text('LEGEND');
        // Primary
        svg.append('line')
            .attr('x1', legX + 60).attr('x2', legX + 110)
            .attr('y1', legY - 3).attr('y2', legY - 3)
            .attr('stroke', amberStroke).attr('stroke-width', 1.4);
        svg.append('text').attr('x', legX + 118).attr('y', legY)
            .attr('font-size', '10.5px').attr('fill', muted)
            .text('primary influence');
        // Secondary
        svg.append('line')
            .attr('x1', legX + 240).attr('x2', legX + 290)
            .attr('y1', legY - 3).attr('y2', legY - 3)
            .attr('stroke', amberStroke).attr('stroke-width', 1.2)
            .attr('stroke-dasharray', '5,3').attr('stroke-opacity', 0.7);
        svg.append('text').attr('x', legX + 298).attr('y', legY)
            .attr('font-size', '10.5px').attr('fill', muted)
            .text('secondary influence');

        // Combined source attribution — all three papers on the timeline
        svg.append('text').attr('x', W / 2).attr('y', H - 22)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('Hersh et al., Med Care 2013;51(8 Suppl 3):S30–S37 (PMID 23774517)  ·  Weiskopf & Weng, JAMIA 2013;20(1):144–151 (PMID 22733976)  ·  Kahn et al., eGEMs 2016;4(1):1244 (PMID 27713905).');
        svg.append('text').attr('x', W / 2).attr('y', H - 8)
            .attr('text-anchor', 'middle')
            .attr('font-size', '10.5px').attr('font-style', 'italic').attr('fill', muted)
            .text('Diagram adapted from Hersh et al. 2013, Figure 1 (Informatics Continuum).');
    }

    function render(name, container, config) {
        var fn = registry[name];
        if (fn) fn(container, config || {});
        else console.warn('VizLibrary: unknown visualization "' + name + '"');
    }

    return { render: render, registry: registry };
})();
